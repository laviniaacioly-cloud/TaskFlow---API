const projetoModel = require("../models/projeto.model");

const projetosController = {
  // GET - MOSTRAR PROJETOS
  listarProjetos(req, res) {
    const projetos = projetoModel.listarProjetos();
    res.json(projetos);
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
    const removido = projetoModel.removerProjeto(id);

    if (!removido) {
      return res.status(404).json({
        mensagem: "Projeto não encontrado",
      });
    }
    res.json({
      mensagem:"Projeto removido com sucesso",
      projeto: removido,
    });
  },
};
module.exports = projetosController;
