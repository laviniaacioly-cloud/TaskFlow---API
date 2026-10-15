const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuario.model");

const authController = { 
  async login(req, res) {
    try {
      const { email, senha_hash } = req.body;

      // 1. Validar os campos
      if (!email || !senha_hash) {
        return res.status(400).json({
          erro: "Email e senha são obrigatórios",
        });
      }

      // 2. Buscar o usuário no PostgreSQL
      const usuario = await usuarioModel.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).json({
          erro: "Credenciais inválidas",
        });
      }

      // 3. Verificar a senha
      if (usuario.senha_hash !== senha_hash) {
        return res.status(401).json({
          erro: "Credenciais inválidas",
        });
      }

      // 4. Gerar o token JWT
      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      // 5. Retornar o token e os dados públicos
      return res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
        },
      });
    } catch (erro) {
      console.error("Erro ao fazer login:", erro);

      return res.status(500).json({
        erro: "Erro interno ao realizar login",
      });
    }
  },
};

module.exports = authController;
