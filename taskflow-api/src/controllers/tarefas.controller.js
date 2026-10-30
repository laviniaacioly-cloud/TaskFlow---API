const tarefaModel = require("../models/tarefa.model");
const usuarioModel = require("../models/usuario.model");
const criarErro = require("../../utils/criarErro");

const tarefasController = {
  // GET - LISTAR TAREFAS
  async listar(req, res) {
    try {
      const { coluna, usuarioId } = req.query;

      let resultado;

      if (usuarioId && coluna) {
        const tarefasUsuario = await tarefaModel.listarPorUsuario(usuarioId);
        resultado = tarefasUsuario.filter((tarefa) => tarefa.coluna === coluna);
      } else if (usuarioId) {
        resultado = await tarefaModel.listarPorUsuario(usuarioId);
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
      const { texto, prioridade_id, prioridade, coluna, projeto_id } = req.body;

      const usuarioId = req.usuario.id;

      if (!texto) {
        return res.status(400).json({
          erro: "Texto obrigatório",
        });
      }

      if (projeto_id == null) {
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
        projetoId: projeto_id,
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

      const { prioridade, coluna } = req.body;

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

      await tarefaModel.remover(id);

      res.status(200).json({
        mensagem: "Tarefa excluída com sucesso",
      });
    } catch (erro) {
      throw erro;
    }
  },
};

module.exports = tarefasController;
