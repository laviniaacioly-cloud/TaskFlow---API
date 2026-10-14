const projetoModel = require("../models/projeto.model");
const tarefaModel = require("../models/tarefa.model");

const projetosController = {
  // GET - MOSTRAR PROJETOS
  async listarProjetos(req, res) {
    try {
      const projetos = await projetoModel.listarProjetos();
      res.json(projetos);
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao listar projetos" });
    }
  },

  // GET - RESUMO DO PROJETO
  async resumoProjeto(req, res) {
    try {
      const id = Number(req.params.id);
      const projeto = await projetoModel.buscarProjeto(id);

      if (!projeto) {
        return res.status(404).json({
          erro: "Projeto não encontrado",
        });
      }

      const tarefas = await tarefaModel.listar();

      const tarefasDoProjeto = tarefas.filter(
        (t) => Number(t.projeto_id ?? t.projetoId) === id,
      );

      const porColuna = {
        afazer: tarefasDoProjeto.filter((t) => t.coluna === "afazer").length,

        andamento: tarefasDoProjeto.filter((t) => t.coluna === "andamento")
          .length,

        concluido: tarefasDoProjeto.filter((t) => t.coluna === "concluido")
          .length,
      };

      res.json({
        projeto,
        totalTarefas: tarefasDoProjeto.length,
        porColuna,
      });
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao buscar resumo do projeto" });
    }
  },

  // GET - BUSCAR POR ID
  async buscarProjetosId(req, res) {
    try {
      const id = Number(req.params.id);
      const projeto = await projetoModel.buscarProjeto(id);

      if (!projeto) {
        return res.status(404).json({
          erro: "Projeto não encontrado",
        });
      }

      res.json(projeto);
    } catch (erro) {
      res.status(500).json({ erro: "Erro ao buscar projeto" });
    }
  },

  // POST - CRIAR NOVOS PROJETOS
  async criarProjetos(req, res) {
    try {
      const { nome, descricao, usuarioId } = req.body;

      if (!nome || nome.trim() === "") {
        return res.status(400).json({
          erro: "Obrigatório informar o nome do projeto!",
        });
      }

      if (!usuarioId) {
        return res.status(400).json({
          erro: "Obrigatório informar o usuário responsável pelo projeto!",
        });
      }

      const novoProjeto = await projetoModel.adicionarProjeto({
        nome: nome.trim(),
        descricao: descricao || "",
        usuarioId,
      });

      res.status(201).json(novoProjeto);
    } catch (erro) {
      console.error("Erro ao criar projeto:", erro);
      res.status(500).json({ erro: "Erro ao criar projeto" });
    }
  },

  // PUT - EDITAR PROJETOS
  async atualizarProjetos(req, res) {
    try {
      const id = Number(req.params.id);

      const projetoExistente = await projetoModel.buscarProjeto(id);

      if (!projetoExistente) {
        return res.status(404).json({
          mensagem: "Projeto não encontrado",
        });
      }

      const atualizado = await projetoModel.atualizarProjeto(id, req.body);

      res.json(atualizado);
    } catch (erro) {
      console.error("Erro ao atualizar projeto:", erro);
      res.status(500).json({ erro: "Erro ao atualizar projeto" });
    }
  },

  // DELETE - APAGAR PROJETOS
  async removerProjetos(req, res) {
    try {
      const id = Number(req.params.id);

      const tarefas = await tarefaModel.listar();

      const tarefasDoProjeto = tarefas.filter(
        (t) => Number(t.projeto_id ?? t.projetoId) === id,
      );

      if (tarefasDoProjeto.length > 0) {
        return res.status(400).json({
          erro: "Projeto possui tarefas associadas.",
        });
      }

      const removido = await projetoModel.removerProjetos(id);

      if (!removido) {
        return res.status(404).json({
          mensagem: "Projeto não encontrado",
        });
      }

      res.json({
        mensagem: "Projeto removido com sucesso",
        projeto: removido,
      });
    } catch (erro) {
      console.error("Erro ao criar projeto:", erro);
      res.status(500).json({ erro: "Erro ao criar projeto" });
    }
  },
};

module.exports = projetosController;
