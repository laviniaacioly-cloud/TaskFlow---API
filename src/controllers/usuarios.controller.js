const usuarioModel = require("../models/usuario.model");

const usuariosController = {
  //GET - LISTAR USUÁRIOS
  listar(req, res) {
    const usuarios = usuarioModel.listarUsuarios();
    res.json(usuarios);
  },

  // GET - BUSCAR POR ID
  buscarPorId(req, res) {
    const id = Number(req.params.id);
    const usuario = usuarioModel.buscarUsuario(id);
    if (!usuario) {
      return res.status(404).json({
        erro: "Usuário não encontrado!",
      });
    }
    res.json(usuario);
  },
  criar(req, res) {
    // req.body contém os dados enviados no body da requisição
    const { nome, email, senha } = req.body;

    // DESAFIO: não permitir dois usuários com o mesmo email
    const emailExistente = usuarioModel.buscarPorEmail(email);
    if (emailExistente) {
      return res.status(409).json({
        erro: "Email já cadastrado! Tente outro.",
      });
    }
    // Criar a nova tarefa com ID gerado pelo servidor
    const novoUsuario = usuarioModel.adicionarUsuario({ nome, email, senha });
    // Retornar a tarefa criada com status 201 Created
    res.status(201).json(novoUsuario);
  },
  // PUT - EDITAR USUARIOS
  atualizar(req, res) {
    const id = Number(req.params.id);
    const usuario = usuarioModel.buscarUsuario(id);
    // Se não encontrou — retornar 404
    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrada" });
    }
    if (req.body.email) {
      const emailExistente = usuarioModel.buscarPorEmail(req.body.email);
      if (emailExistente && emailExistente.id !== id) {
        return res.status(409).json({
          erro: "Este email já está cadastrado",
        });
      }
    }
    const atualizado = usuarioModel.atualizarUsuario(id, req.body);
    res.json(atualizado);
  },
  //DELETE - REMOVER USUÀRIO
  remover(req, res) {
    const id = Number(req.params.id);
    const removido = usuarioModel.removerUsuario(id);
    if (!removido) {
      return res.status(404).json({ erro: "Usuário não encontrado!" });
    }
    res.json({ mensagem: "Usuário removido com sucesso!", usuario: removido });
  },
};
module.exports = usuariosController;
