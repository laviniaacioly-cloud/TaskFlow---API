const tarefaModel = require("../models/tarefa.model");
const usuarioModel = require("../models/usuario.model");

const tarefasController = {
  // GET - LISTAR TAREFAS
  listar(req, res) {
    const { coluna } = req.query;
    const { usuario } = req;
  console.log("usuario id: ", usuario.id);
    let resultado;

    if (usuario.id) {
      resultado = tarefaModel.listarPorUsuario(parseInt(usuario.id));

      // Se também tiver coluna, filtra os dois
      if (coluna) {
        resultado = resultado.filter((t) => t.coluna === coluna);
      }
    } else if (coluna) {
      resultado = tarefaModel.listarPorColuna(coluna);
    } else {
      resultado = tarefaModel.listar();
    }

    res.json(resultado);
  },

  // GET - ESTATISTICAS
  estatisticas(req, res) {
    const estatisticas = tarefaModel.estatisticas();

    const usuarios = usuarioModel.listarUsuarios();

    const rankingUsuarios = usuarios
      .map((usuario) => {
        const totalTarefas = tarefaModel.listarPorUsuario(usuario.id).length;

        return {
          usuarioId: usuario.id,
          nome: usuario.nome,
          totalTarefas,
        };
      })
      .sort((a, b) => b.totalTarefas - a.totalTarefas);

    res.json({
      ...estatisticas,
      rankingUsuarios,
    });
  },

  // GET - RESUMO
  resumo(req, res) {
    const resumo = tarefaModel.resumo();

    res.json(resumo);
  },

  // GET - BUSCAR POR ID
  buscarPorId(req, res) {
    const tarefa = tarefaModel.buscar(parseInt(req.params.id));

    if (!tarefa) {
      return res.status(404).json({
        erro: "Tarefa não encontrada",
      });
    }

    res.json(tarefa);
  },

  // POST - CRIAR TAREFA
  criar(req, res) {
    const { texto, prioridade, coluna, projetoId } = req.body;
    const usuarioId = req.usuario.id;

    // Validação do texto
    if (!texto) {
      return res.status(400).json({
        erro: "texto obrigatorio",
      });
    }

    // // BASE A - validar usuário
    // if (usuarioId !== undefined) {
    //   const usuario = usuarioModel.buscarUsuario(parseInt(usuarioId));

    //   if (!usuario) {
    //     return res.status(400).json({
    //       erro: "Usuário não encontrado",
    //     });
    //   }
    // }

    // BASE B - validar prioridade
    if (
      prioridade !== undefined &&
      !["alta", "media", "baixa"].includes(prioridade)
    ) {
      return res.status(400).json({
        erro: "Prioridade inválida. Use: alta, media ou baixa",
      });
    }

    // BASE B - validar coluna
    if (
      coluna !== undefined &&
      !["afazer", "andamento", "concluido"].includes(coluna)
    ) {
      return res.status(400).json({
        erro: "Coluna inválida. Use: afazer, andamento ou concluido",
      });
    }

    // NÍVEL 1A - limite de 2 tarefas em andamento
    if (coluna === "andamento") {
      const tarefasDoUsuario = tarefaModel.listarPorUsuario(usuarioId);
      const emAndamento = tarefasDoUsuario.filter(
        (tarefa) => tarefa.coluna === "andamento",
      ).length;

      if (emAndamento >= 2) {
        return res.status(400).json({
          erro: "Limite de 2 tarefas em andamento por usuário atingido",
        });
      }
    }

    const novaTarefa = tarefaModel.adicionar({
      texto,
      prioridade,
      coluna,
      usuarioId,
      projetoId,
    });

    res.status(201).json(novaTarefa);
  },

  // PUT - EDITAR TAREFA
  atualizar(req, res) {
    const id = parseInt(req.params.id);
    const tarefa = tarefaModel.buscar(id);

    if (!tarefa) {
      return res.status(404).json({
        erro: "Tarefa não encontrada",
      });
    }
    if (tarefa.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        erro: "Você não pode alterar uma tarefa de outro usuário",
      });
    }

    const { prioridade, coluna } = req.body;
    const usuarioId = req.usuario.id;

    // BASE B - validar prioridade
    if (
      prioridade !== undefined &&
      !["alta", "media", "baixa"].includes(prioridade)
    ) {
      return res.status(400).json({
        erro: "Prioridade inválida. Use: alta, media ou baixa",
      });
    }

    // BASE B - validar coluna
    if (
      coluna !== undefined &&
      !["afazer", "andamento", "concluido"].includes(coluna)
    ) {
      return res.status(400).json({
        erro: "Coluna inválida. Use: afazer, andamento ou concluido",
      });
    }

    // NÍVEL 1A - limite de 2 em andamento
    if (coluna === "andamento" && tarefa.coluna !== "andamento") {
      const idUsuario =
        usuarioId !== undefined ? parseInt(usuarioId) : tarefa.usuarioId;

      if (idUsuario !== undefined) {
        const tarefasDoUsuario = tarefaModel.listarPorUsuario(idUsuario);

        const emAndamento = tarefasDoUsuario.filter(
          (t) => t.coluna === "andamento" && t.id !== id,
        ).length;

        if (emAndamento >= 2) {
          return res.status(400).json({
            erro: "Limite de 2 tarefas em andamento por usuário atingido",
          });
        }
      }
    }

    // NÍVEL 1B - data de conclusão automática
    let dadosAtualizacao = {
      ...req.body,
    };

    delete dadosAtualizacao.usuarioId;
    // O usuário não pode definir concluidaEm manualmente
    delete dadosAtualizacao.concluidaEm;

    // Entrou em concluído → servidor cria a data
    if (coluna === "concluido" && tarefa.coluna !== "concluido") {
      dadosAtualizacao.concluidaEm = new Date().toISOString();
    }

    // Saiu de concluído → limpa a data
    if (
      coluna !== undefined &&
      coluna !== "concluido" &&
      tarefa.coluna === "concluido"
    ) {
      dadosAtualizacao.concluidaEm = null;
    }

    const atualizada = tarefaModel.atualizar(id, dadosAtualizacao);

    res.json(atualizada);
  },

  // DELETE - DELETAR TAREFA
  remover(req, res) {
    const id = parseInt(req.params.id);
    const tarefa = tarefaModel.buscar(id);

    if (!tarefa) {
      return res.status(404).json({
        erro: "Tarefa nao encontrada",
      });
    }

    if (tarefa.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        erro: "Você não pode remover uma tarefa de outro usuário",
      });
    }

    const removida = tarefaModel.remover(id);

    res.json({
      mensagem: "Tarefa removida com sucesso",
      tarefa: removida,
    });
  },
};
module.exports = tarefasController;
