const tarefaModel = require("../models/tarefa.model");
const usuarioModel = require("../models/usuario.model");

const tarefasController = {
  // GET - LISTAR TAREFAS
  async listar(req, res) {
    try {
      const { coluna } = req.query;
      const usuario = req.usuario;

      let resultado;

      if (usuario?.id) {
        resultado = await tarefaModel.listarPorUsuario(
          parseInt(usuario.id, 10),
        );

        if (coluna) {
          resultado = resultado.filter((t) => t.coluna === coluna);
        }
      } else if (coluna) {
        resultado = await tarefaModel.listarPorColuna(coluna);
      } else {
        resultado = await tarefaModel.listar();
      }

      res.json(resultado);
    } catch (erro) {
      console.error("Erro ao listar tarefas:", erro);
      res.status(500).json({ erro: "Erro ao listar tarefas" });
    }
  },

  // GET - ESTATISTICAS
  async estatisticas(req, res) {
    try {
      const estatisticas = await tarefaModel.estatisticas();
      const usuarios = await usuarioModel.listarUsuarios();

      const rankingUsuarios = await Promise.all(
        usuarios.map(async (usuario) => {
          const tarefas = await tarefaModel.listarPorUsuario(usuario.id);

          return {
            usuarioId: usuario.id,
            nome: usuario.nome,
            totalTarefas: tarefas.length,
          };
        }),
      );

      rankingUsuarios.sort((a, b) => b.totalTarefas - a.totalTarefas);

      res.json({
        ...estatisticas,
        rankingUsuarios,
      });
    } catch (erro) {
      console.error("Erro ao buscar estatísticas:", erro);
      res.status(500).json({ erro: "Erro ao buscar estatísticas" });
    }
  },

  // GET - RESUMO
  async resumo(req, res) {
    try {
      const resumo = await tarefaModel.resumo();
      res.json(resumo);
    } catch (erro) {
      console.error("Erro ao gerar resumo:", erro);
      res.status(500).json({ erro: "Erro ao gerar resumo" });
    }
  },

  // GET - BUSCAR POR ID
  async buscarPorId(req, res) {
    try {
      const tarefa = await tarefaModel.buscar(parseInt(req.params.id, 10));

      if (!tarefa) {
        return res.status(404).json({
          erro: "Tarefa não encontrada",
        });
      }

      res.json(tarefa);
    } catch (erro) {
      console.error("Erro ao buscar tarefa:", erro);
      res.status(500).json({ erro: "Erro ao buscar tarefa" });
    }
  },

  // POST - CRIAR TAREFA
  async criar(req, res) {
    try {
      const { texto, prioridade, coluna, projetoId } = req.body;
      const usuarioId = req.usuario.id;

      // Validação do texto
      if (!texto) {
        return res.status(400).json({
          erro: "texto obrigatorio",
        });
      }

      // Validar prioridade
      if (
        prioridade !== undefined &&
        !["alta", "media", "baixa"].includes(prioridade)
      ) {
        return res.status(400).json({
          erro: "Prioridade inválida. Use: alta, media ou baixa",
        });
      }

      // Validar coluna
      if (
        coluna !== undefined &&
        !["afazer", "andamento", "concluido"].includes(coluna)
      ) {
        return res.status(400).json({
          erro: "Coluna inválida. Use: afazer, andamento ou concluido",
        });
      }

      // Limite de 2 tarefas em andamento por usuário
      if (coluna === "andamento") {
        const tarefasDoUsuario =
          await tarefaModel.listarPorUsuario(usuarioId);

        const emAndamento = tarefasDoUsuario.filter(
          (tarefa) => tarefa.coluna === "andamento",
        ).length;

        if (emAndamento >= 2) {
          return res.status(400).json({
            erro: "Limite de 2 tarefas em andamento por usuário atingido",
          });
        }
      }

      const novaTarefa = await tarefaModel.adicionar({
        texto,
        prioridade,
        coluna,
        usuarioId,
        projetoId,
      });

      res.status(201).json(novaTarefa);
    } catch (erro) {
      console.error("Erro ao criar tarefa:", erro);
      res.status(500).json({ erro: "Erro ao criar tarefa" });
    }
  },

  // PUT - EDITAR TAREFA
  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const tarefa = await tarefaModel.buscar(id);

      if (!tarefa) {
        return res.status(404).json({
          erro: "Tarefa não encontrada",
        });
      }

      // O PostgreSQL retorna usuario_id, em snake_case.
      const donoId = tarefa.usuario_id ?? tarefa.usuarioId;

      if (Number(donoId) !== Number(req.usuario.id)) {
        return res.status(403).json({
          erro: "Você não pode alterar uma tarefa de outro usuário",
        });
      }

      const { prioridade, coluna } = req.body;
      const usuarioId = req.usuario.id;

      // Validar prioridade
      if (
        prioridade !== undefined &&
        !["alta", "media", "baixa"].includes(prioridade)
      ) {
        return res.status(400).json({
          erro: "Prioridade inválida. Use: alta, media ou baixa",
        });
      }

      // Validar coluna
      if (
        coluna !== undefined &&
        !["afazer", "andamento", "concluido"].includes(coluna)
      ) {
        return res.status(400).json({
          erro: "Coluna inválida. Use: afazer, andamento ou concluido",
        });
      }

      // Limite de 2 tarefas em andamento
      if (
        coluna === "andamento" &&
        tarefa.coluna !== "andamento"
      ) {
        const tarefasDoUsuario =
          await tarefaModel.listarPorUsuario(usuarioId);

        const emAndamento = tarefasDoUsuario.filter(
          (t) =>
            t.coluna === "andamento" &&
            Number(t.id) !== id,
        ).length;

        if (emAndamento >= 2) {
          return res.status(400).json({
            erro: "Limite de 2 tarefas em andamento por usuário atingido",
          });
        }
      }

      const dadosAtualizacao = { ...req.body };

      delete dadosAtualizacao.usuarioId;
      delete dadosAtualizacao.usuario_id;
      delete dadosAtualizacao.concluidaEm;
      delete dadosAtualizacao.concluida_em;

      // O model atualiza as colunas que ele conhece.
      const atualizada = await tarefaModel.atualizar(
        id,
        dadosAtualizacao,
      );

      if (!atualizada) {
        return res.status(404).json({
          erro: "Tarefa não encontrada",
        });
      }

      res.json(atualizada);
    } catch (erro) {
      console.error("Erro ao atualizar tarefa:", erro);
      res.status(500).json({ erro: "Erro ao atualizar tarefa" });
    }
  },

  // DELETE - DELETAR TAREFA
  async remover(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const tarefa = await tarefaModel.buscar(id);

      if (!tarefa) {
        return res.status(404).json({
          erro: "Tarefa não encontrada",
        });
      }

      // O PostgreSQL retorna usuario_id, em snake_case.
      const donoId = tarefa.usuario_id ?? tarefa.usuarioId;

      if (Number(donoId) !== Number(req.usuario.id)) {
        return res.status(403).json({
          erro: "Você não pode remover uma tarefa de outro usuário",
        });
      }

      const removida = await tarefaModel.remover(id);

      res.json({
        mensagem: "Tarefa removida com sucesso",
        tarefa: removida,
      });
    } catch (erro) {
      console.error("Erro ao remover tarefa:", erro);
      res.status(500).json({ erro: "Erro ao remover tarefa" });
    }
  },
};

module.exports = tarefasController;