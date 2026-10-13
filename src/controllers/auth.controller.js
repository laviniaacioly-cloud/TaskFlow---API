const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuario.model");

const authController = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      console.log("Email recebido:", JSON.stringify(email));
      console.log("Senha recebida:", JSON.stringify(senha));
      console.log("Tipo da senha:", typeof senha);

      // Validar os campos
      if (!email || !senha) {
        return res.status(400).json({
          erro: "Email e senha são obrigatórios",
        });
      }

      // Buscar usuário no banco de dados
      const usuario = await usuarioModel.buscarPorEmail(email);

      console.log("Usuário encontrado:", !!usuario);
      console.log("Dados retornados:", usuario ? Object.keys(usuario) : null);
      console.log("Senha recebida:", JSON.stringify(senha));
      console.log("Senha retornada:", JSON.stringify(usuario?.senha));

      if (!usuario) {
        return res.status(401).json({
          erro: "Credenciais inválidas",
        });
      }

      // Comparar a senha
      if (usuario.senha_hash !== senha) {
        return res.status(401).json({
          erro: "Credenciais inválidas",
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome },
        process.env.JWT_SECRET,
        { expiresIn: "8h" },
      );

      // Retornar token e dados públicos
      return res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
        },
      });
    } catch (erro) {
      console.error("Erro no login:", erro);

      return res.status(500).json({
        erro: "Erro interno ao realizar login",
      });
    }
  },
};

module.exports = authController;
