const prioridadeModel = require("../models/prioridade.model");

const prioridadesController = {
    
  // GET - LISTAR TAREFAS POR PRIORIDADE
  async listarTarefas(req, res) {
    try {
      const tarefas =
        await prioridadeModel.listarTarefasPorPrioridade();

      res.json(tarefas);
    } catch (erro) {
      throw erro;
    }
  },
};

module.exports = prioridadesController;