const projetoModel = require("../models/projeto.model");
const tarefaModel = require("../models/tarefa.model");

const projetosController = {
  // GET - MOSTRAR PROJETOS
  listarProjetos(req, res) {
    const projetos = projetoModel.listarProjetos();
    res.json(projetos);
  },
  // GET - RESUMO DO PROJETO
  resumoProjeto(req, res) {
    const id = Number(req.params.id);
    const projeto = projetoModel.buscarProjeto(id);

    if (!projeto) {
      return res.status(404).json({
        erro: "Projeto não encontrado",
      });
    }
    const tarefasDoProjeto = tarefaModel
      .listar()
      .filter((t) => t.projetoId === id);
    const porColuna = {
      afazer: tarefasDoProjeto.filter((tarefa) => tarefa.coluna === "afazer")
        .length,

      andamento: tarefasDoProjeto.filter(
        (tarefa) => tarefa.coluna === "andamento",
      ).length,

      concluido: tarefasDoProjeto.filter(
        (tarefa) => tarefa.coluna === "concluido",
      ).length,
    };
    res.json({ projeto, totalTarefas: tarefasDoProjeto.length, porColuna });
  },
  // GET - BUSCAR POR ID
  buscarProjetosId(req, res) {
    const id = Number(req.params.id);
    const projeto = projetoModel.buscarProjeto(id);
    if (!projeto) {
      return res.status(404).json({ erro: "Projeto não encontrada" });
    }
    // Se encontrou — retornar a tarefa
    res.json(projeto);
  },
  // POST - CRIAR NOVOS PROJETOS
  criarProjetos(req, res) {
    const { nome, descricao, ativo } = req.body;

    if (!nome || nome.trim() === "") {
      return res.status(400).json({
        erro: "Obrigatório informar o nome do projeto!",
      });
    }

    const novoProjeto = projetoModel.adicionarProjeto({
      nome: nome.trim(),
      descricao: descricao || "",
      ativo: ativo ?? true,
    });
    res.status(201).json(novoProjeto);
  },

  // PUT - EDITAR PROJETOS
  atualizarProjetos(req, res) {
    const id = Number(req.params.id);
    const projeto = projetoModel.atualizarProjeto(id);

    if (!projeto) {
      return res.status(404).json({
        mensagem: "Projeto não encontrado",
      });
    }
    const atualizado = projetoModel.atualizarProjeto(id, req.body);
    res.json(atualizado);
  },
  // DELETE - APAGAR PROJETOS
  removerProjetos(req, res) {
    const id = Number(req.params.id);
    const tarefasDoProjeto = tarefaModel
      .listar()
      .filter((t) => t.projetoId === id);

    if (tarefasDoProjeto.length > 0) {
      return res.status(400).json({
        erro: "Projeto possui tarefas associadas.",
      });
    }
    const removido = projetoModel.removerProjetos(id);

    if (!removido) {
      return res.status(404).json({
        mensagem: "Projeto não encontrado",
      });
    }
    res.json({
      mensagem: "Projeto removido com sucesso",
      projeto: removido,
    });
  },
};
module.exports = projetosController;
