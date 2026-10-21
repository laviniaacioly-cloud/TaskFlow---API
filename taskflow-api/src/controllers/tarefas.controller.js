const tarefaModel = require("../models/tarefa.model");
const usuarioModel = require("../models/usuario.model");
const criarErro = require("../../utils/criarErro");
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
      throw erro;
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
      throw erro;
    }
  },

  // GET - RESUMO
  async resumo(req, res) {
    try {
      const resumo = await tarefaModel.resumo();
      res.json(resumo);
    } catch (erro) {
      throw erro;
    }
  },

  // GET - BUSCAR POR ID
  async buscarPorId(req, res) {
    try {
      const tarefa = await tarefaModel.buscar(parseInt(req.params.id, 10));

      if (!tarefa) {
        throw criarErro(404, "Tarefa não encontrada");
      }

      res.json(tarefa);
    } catch (erro) {
      throw erro;
    }
  },


  // POST - CRIAR TAREFA
  async criar(req, res) {
    try {
      const {
        texto,
        prioridade_id,
        prioridade,
        coluna,
        projeto_id,
        projetoId,
      } = req.body;

      const usuarioId = req.usuario.id;
      const projetoIdFinal = projeto_id ?? projetoId;

      if (!texto) {
        return res.status(400).json({
          erro: "Texto obrigatório",
        });
      }

      if (projetoIdFinal == null) {
        return res.status(400).json({
          erro: "O projeto é obrigatório",
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


      const novaTarefa = await tarefaModel.adicionar({
        texto,
        prioridade_id,
        prioridade,
        coluna,
        usuarioId,
        projetoId: projetoIdFinal,
      });

      res.status(201).json(novaTarefa);
    } catch (erro) {
      throw erro;
    }
  },


  // PUT - EDITAR TAREFA
  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const tarefa = await tarefaModel.buscar(id);

      if (!tarefa) {
        throw criarErro(404, "Tarefa não encontrada");
      }

      // O PostgreSQL retorna usuario_id, em snake_case.
      const donoId = tarefa.usuario_id ?? tarefa.usuarioId;
        console.log("Dono da tarefa:", donoId);
        console.log("Usuário autenticado:", req.usuario.id);
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


      const dadosAtualizacao = { ...req.body };

      delete dadosAtualizacao.concluidaEm;
      delete dadosAtualizacao.concluida_em;

      // O model atualiza as colunas que ele conhece.
      const atualizada = await tarefaModel.atualizar(id, dadosAtualizacao);

      if (!atualizada) {
        throw criarErro(404, "Tarefa não encontrada");
      }

      res.json(atualizada);
    } catch (erro) {
      throw erro;
    }
  },

  // DELETE - DELETAR TAREFA
  async remover(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const tarefa = await tarefaModel.buscar(id);

      if (!tarefa) {
        throw criarErro(404, "Tarefa não encontrada");
      }

      // O PostgreSQL retorna usuario_id, em snake_case.
      const donoId = tarefa.usuario_id ?? tarefa.usuarioId;

      if (Number(donoId) !== Number(req.usuario.id)) {
        return res.status(403).json({
          erro: "Você não pode remover uma tarefa de outro usuário",
        });
      }

      await tarefaModel.remover(id);

      // Sucesso: excluída sem corpo na resposta
      res.status(204).end();
    } catch (erro) {
      throw erro;
    }
  },
};

module.exports = tarefasController;
