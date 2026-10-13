const tarefaModel = require("../models/tarefa.model");
const usuarioModel = require("../models/usuario.model");

const tarefasController = {
  // GET - LISTAR TAREFAS
  async listar(req, res) {
    try {
      const { coluna } = req.query;
      const usuarioId = req.usuario?.id;

      let resultado;

      if (usuarioId) {
        resultado = await tarefaModel.listarPorUsuario(Number(usuarioId));

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
      res.status(500).json({
        erro: "Erro ao buscar estatísticas",
      });
    }
  },

  // GET - RESUMO
  async resumo(req, res) {
    try {
      const resumo = await tarefaModel.resumo();
      res.json(resumo);
    } catch (erro) {
      console.error("Erro ao buscar resumo:", erro);
      res.status(500).json({
        erro: "Erro ao buscar resumo",
      });
    }
  },

  // GET - BUSCAR POR ID
  async buscarPorId(req, res) {
    try {
      const tarefa = await tarefaModel.buscar(Number(req.params.id));

      if (!tarefa) {
        return res.status(404).json({
          erro: "Tarefa não encontrada",
        });
      }

      res.json(tarefa);
    } catch (erro) {
      console.error("Erro ao buscar tarefa:", erro);
      res.status(500).json({
        erro: "Erro ao buscar tarefa",
      });
    }
  },

  // POST - CRIAR TAREFA
  async criar(req, res) {
    try {
      const { texto, prioridade, coluna, projetoId } = req.body;
      const usuarioId = req.usuario.id;

      if (!texto) {
        return res.status(400).json({
          erro: "Texto obrigatório",
        });
      }

      if (
        prioridade !== undefined &&
        !["alta", "media", "baixa"].includes(prioridade)
      ) {
        return res.status(400).json({
          erro: "Prioridade inválida. Use: alta, media ou baixa",
        });
      }

      if (
        coluna !== undefined &&
        !["afazer", "andamento", "concluido"].includes(coluna)
      ) {
        return res.status(400).json({
          erro: "Coluna inválida. Use: afazer, andamento ou concluido",
        });
      }

      const tarefasDoUsuario = await tarefaModel.listarPorUsuario(usuarioId);

      if (coluna === "andamento") {
        const emAndamento = tarefasDoUsuario.filter(
          (tarefa) => tarefa.coluna === "andamento",
        ).length;

        if (emAndamento >= 2) {
          return res.status(400).json({
            erro: "Limite de 2 tarefas em andamento por usuário atingido",
          });
        }
      }

      const db = require("../database/db");

      const prioridadeResult = await db.query(
        "SELECT id FROM prioridades WHERE descricao = $1",
        [prioridade || "media"],
      );

      if (prioridadeResult.rows.length === 0) {
        return res.status(400).json({
          erro: "Prioridade não encontrada no banco",
        });
      }

      const novaTarefa = await tarefaModel.adicionar({
        texto,
        prioridadeId: prioridadeResult.rows[0].id,
        coluna: coluna || "afazer",
        usuarioId,
        projetoId,
      });

      res.status(201).json(novaTarefa);
    } catch (erro) {
      console.error("Erro ao criar tarefa:", erro);
      res.status(500).json({
        erro: "Erro ao criar tarefa",
      });
    }
  },

  // PUT - ATUALIZAR TAREFA
  async atualizar(req, res) {
    try {
      const id = Number(req.params.id);

      const tarefa = await tarefaModel.buscar(id);

      if (!tarefa) {
        return res.status(404).json({
          erro: "Tarefa não encontrada",
        });
      }

      if (Number(tarefa.usuario_id) !== Number(req.usuario.id)) {
        return res.status(403).json({
          erro: "Você não tem permissão para atualizar esta tarefa",
        });
      }

      const { prioridade, coluna } = req.body;

      if (
        prioridade !== undefined &&
        !["alta", "media", "baixa"].includes(prioridade)
      ) {
        return res.status(400).json({
          erro: "Prioridade inválida. Use: alta, media ou baixa",
        });
      }

      if (
        coluna !== undefined &&
        !["afazer", "andamento", "concluido"].includes(coluna)
      ) {
        return res.status(400).json({
          erro: "Coluna inválida. Use: afazer, andamento ou concluido",
        });
      }

      if (coluna === "andamento" && tarefa.coluna !== "andamento") {
        const tarefasDoUsuario = await tarefaModel.listarPorUsuario(
          req.usuario.id,
        );

        const emAndamento = tarefasDoUsuario.filter(
          (item) => item.coluna === "andamento",
        ).length;

        if (emAndamento >= 2) {
          return res.status(400).json({
            erro: "Limite de 2 tarefas em andamento por usuário atingido",
          });
        }
      }

      let prioridadeId = tarefa.prioridade_id;

      if (prioridade !== undefined) {
        const db = require("../database/db");

        const resultado = await db.query(
          "SELECT id FROM prioridades WHERE descricao = $1",
          [prioridade],
        );

        if (resultado.rows.length === 0) {
          return res.status(400).json({
            erro: "Prioridade não encontrada no banco",
          });
        }

        prioridadeId = resultado.rows[0].id;
      }

      const dadosAtualizacao = {
        texto: req.body.texto ?? tarefa.texto,
        prioridadeId,
        coluna: coluna ?? tarefa.coluna,
        usuarioId: tarefa.usuario_id,
        projetoId: req.body.projetoId ?? tarefa.projeto_id,
      };

      const atualizada = await tarefaModel.atualizar(id, dadosAtualizacao);

      return res.json(atualizada);
    } catch (erro) {
      console.error("Erro ao atualizar tarefa:", erro);

      return res.status(500).json({
        erro: "Erro ao atualizar tarefa",
      });
    }
  },

  // DELETE - REMOVER TAREFA
  async remover(req, res) {
    try {
      const id = Number(req.params.id);

      const tarefa = await tarefaModel.buscar(id);

      if (!tarefa) {
        return res.status(404).json({
          erro: "Tarefa não encontrada",
        });
      }

      if (tarefa.usuario_id !== req.usuario.id) {
        return res.status(403).json({
          erro: "Você não tem permissão para remover esta tarefa",
        });
      }

      const removida = await tarefaModel.remover(id);

      return res.json({
        mensagem: "Tarefa removida com sucesso",
        tarefa: removida,
      });
    } catch (erro) {
      console.error("Erro ao remover tarefa:", erro);

      return res.status(500).json({
        erro: "Erro ao remover tarefa",
      });
    }
  },
};
module.exports = tarefasController;