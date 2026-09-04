const tarefaModel = require("../models/tarefa.model");

const tarefasController = {
  // GET - LISTAR TAREFAS
  listar(req, res) {
    const { coluna } = req.query;
    const resultado = coluna
      ? tarefaModel.listarPorColuna(coluna)
      : tarefaModel.listar();
    res.json(resultado);
  },

  // ESTATISTICAS
  estatisticas(req, res) {
  const estatisticas = tarefaModel.estatisticas();
  res.json(estatisticas);
  },

  resumo(req, res) {
    const resumo = tarefaModel.resumo();
    res.json(resumo);
  },
  
  // GET - BRUSCAR POR ID
  buscarPorId(req, res) {
    const tarefa = tarefaModel.buscar(parseInt(req.params.id));
    if (!tarefa)
      return res.status(404).json({
        erro: "Tarefa não encontrada",
      });
    res.json(tarefa);
  },

  // POST - CRIAR TAREFAS
  criar(req, res) {
    const { texto } = req.body;
    if (!texto)
      return res.status(400).json({
        erro: "texto obrigatorio",
      });
    res.status(201).json(tarefaModel.adicionar(req.body));
  },


  // PUT - EDITAR TAREFAS
  atualizar(req, res) {
    const atualizada = tarefaModel.atualizar(parseInt(req.params.id), req.body);
    if (!atualizada)
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    res.json(atualizada);
  },

  // DELETE - DELETAR TAREFA
  remover(req, res) {
    const removida = tarefaModel.remover(parseInt(req.params.id));
    if (!removida) return res.status(404).json({ erro: "Tarefa nao encontrada" });
    res.json({ mensagem: "Tarefa removida com sucesso", tarefa: removida });
  },
};
module.exports = tarefasController;
