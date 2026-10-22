const prioridadeModel = require("../models/prioridade.model");

const prioridadesController = {
  // GET - LISTAR PRIORIDADES
  async listarTodas(req, res) {
    const prioridades = await prioridadeModel.listarTodas();
    res.json(prioridades);
  },

    // POST - CADASTRAR PRIORIDADE
  async criar(req, res) {
    const { descricao, cor } = req.body;

    if (!descricao || !descricao.trim()) {
      return res.status(400).json({
        erro: "O nome da prioridade é obrigatório",
      });
    }

    if (
      typeof cor !== "string" ||
      !/^#[0-9A-Fa-f]{6}$/.test(cor)
    ) {
      return res.status(400).json({
        erro: "Informe uma cor hexadecimal válida, como #FF0000",
      });
    }

    const prioridade = await prioridadeModel.criar({
      descricao: descricao.trim(),
      cor,
    });

    res.status(201).json(prioridade);
  },

 // PUT - EDITAR PRIORIDADE
  async atualizar(req, res) {
    const id = Number(req.params.id);
    const { descricao, cor } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: { mensagem: "ID da prioridade inválido" },
      });
    }

    if (typeof descricao !== "string" || !descricao.trim()) {
      return res.status(400).json({
        erro: { mensagem: "O nome da prioridade é obrigatório" },
      });
    }

    if (typeof cor !== "string" || !/^#[0-9A-Fa-f]{6}$/.test(cor)) {
      return res.status(400).json({
        erro: {
          mensagem: "Informe uma cor hexadecimal válida, como #FF0000",
        },
      });
    }

    const prioridade = await prioridadeModel.atualizar(id, {
      descricao: descricao.trim(),
      cor,
    });

    if (!prioridade) {
      return res.status(404).json({
        erro: { mensagem: "Prioridade não encontrada" },
      });
    }

    res.json(prioridade);
  },

  // DELETE - EXCLUIR PRIORIDADE
  async excluir(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        erro: { mensagem: "ID da prioridade inválido" },
      });
    }

    const resultado = await prioridadeModel.excluir(id);

    if (!resultado) {
      return res.status(404).json({
        erro: { mensagem: "Prioridade não encontrada" },
      });
    }

    if (resultado.emUso) {
      return res.status(409).json({
        erro: {
          mensagem:
            "Não é possível excluir esta prioridade porque existem tarefas utilizando-a",
        },
      });
    }

    res.json({
      mensagem: "Prioridade excluída com sucesso",
      prioridade: resultado,
    });
  },

  // GET - LISTAR TAREFAS POR PRIORIDADE
  async listarTarefas(req, res) {
    const tarefas = await prioridadeModel.listarTarefasPorPrioridade();
    res.json(tarefas);
  },
};

module.exports = prioridadesController;
