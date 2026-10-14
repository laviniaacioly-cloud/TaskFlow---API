
const usuarioModel = require("../models/usuario.model");
const tarefaModel = require("../models/tarefa.model");

const usuariosController = {
  // GET - LISTAR USUÁRIOS
  async listar(req, res) {
    try {
      const usuarios = await usuarioModel.listarUsuarios();
      res.json(usuarios);
    } catch (erro) {
      console.error("Erro ao listar usuários:", erro);
      res.status(500).json({ erro: "Erro ao listar usuários" });
    }
  },

  // GET - BUSCAR POR ID
  async buscarPorId(req, res) {
    try {
      const id = Number(req.params.id);
      const usuario = await usuarioModel.buscarUsuario(id);

      if (!usuario) {
        return res.status(404).json({
          erro: "Usuário não encontrado!",
        });
      }

      res.json(usuario);
    } catch (erro) {
      console.error("Erro ao buscar usuário:", erro);
      res.status(500).json({ erro: "Erro ao buscar usuário" });
    }
  },

  // POST - CRIAR USUÁRIO
  async criar(req, res) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({
          erro: "Nome, e-mail e senha são obrigatórios.",
        });
      }

      const emailExistente = await usuarioModel.buscarPorEmail(email);

      if (emailExistente) {
        return res.status(409).json({
          erro: "Email já cadastrado! Tente outro.",
        });
      }

      const novoUsuario = await usuarioModel.adicionarUsuario({
        nome,
        email,
        senha,
      });

      res.status(201).json(novoUsuario);
    } catch (erro) {
      console.error("Erro ao criar usuário:", erro);
      res.status(500).json({ erro: "Erro ao criar usuário" });
    }
  },

  // PUT - EDITAR USUÁRIO
  async atualizar(req, res) {
    try {
      const id = Number(req.params.id);
      const usuario = await usuarioModel.buscarUsuario(id);

      if (!usuario) {
        return res.status(404).json({
          erro: "Usuário não encontrado!",
        });
      }

      if (req.body.email) {
        const emailExistente = await usuarioModel.buscarPorEmail(
          req.body.email
        );

        if (emailExistente && emailExistente.id !== id) {
          return res.status(409).json({
            erro: "Este email já está cadastrado",
          });
        }
      }

      const atualizado = await usuarioModel.atualizarUsuario(id, req.body);
      res.json(atualizado);
    } catch (erro) {
      console.error("Erro ao atualizar usuário:", erro);
      res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
  },

  // DELETE - REMOVER USUÁRIO
  async remover(req, res) {
    try {
      const id = Number(req.params.id);

      // Verificar se o usuário existe
      const usuario = await usuarioModel.buscarUsuario(id);

      if (!usuario) {
        return res.status(404).json({
          erro: "Usuário não encontrado!",
        });
      }

      // Buscar tarefas associadas ao usuário
      const tarefas = await tarefaModel.listar();

      const tarefasDoUsuario = tarefas.filter(
        (t) => Number(t.usuario_id ?? t.usuarioId) === id
      );

      if (tarefasDoUsuario.length > 0) {
        return res.status(400).json({
          erro: "Usuário possui tarefas. Remova as tarefas antes.",
        });
      }

      const removido = await usuarioModel.removerUsuario(id);

      res.json({
        mensagem: "Usuário removido com sucesso!",
        usuario: removido,
      });
    } catch (erro) {
      console.error("Erro ao remover usuário:", erro);
      res.status(500).json({ erro: "Erro ao remover usuário" });
    }
  },
};

module.exports = usuariosController;
