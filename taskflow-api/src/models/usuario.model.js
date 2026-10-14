
const pool = require("../database/db");

module.exports = {
  // GET - Listar usuários
  listarUsuarios: async () => {
    const result = await pool.query(
      "SELECT id, nome, email FROM usuario ORDER BY id"
    );
    return result.rows;
  },

  // GET - Buscar por ID
  buscarUsuario: async (id) => {
    const result = await pool.query(
      "SELECT * FROM usuario WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  },

  // Buscar por e-mail
  buscarPorEmail: async (email) => {
    const result = await pool.query(
      "SELECT * FROM usuario WHERE email = $1",
      [email]
    );
    return result.rows[0] || null;
  },

  // POST - Adicionar usuário
  adicionarUsuario: async ({ nome, email, senha }) => {
    const result = await pool.query(
      `INSERT INTO usuario (nome, email, senha_hash)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email`,
      [nome, email, senha]
    );
    return result.rows[0];
  },

  // PUT - Atualizar usuário
  atualizarUsuario: async (id, dados) => {
    const usuarioAtual = await pool.query(
      "SELECT * FROM usuario WHERE id = $1",
      [id]
    );

    if (usuarioAtual.rows.length === 0) return null;

    const atual = usuarioAtual.rows[0];

    const result = await pool.query(
      `UPDATE usuario
       SET nome = $1, email = $2
       WHERE id = $3
       RETURNING id, nome, email`,
      [
        dados.nome ?? atual.nome,
        dados.email ?? atual.email,
        id
      ]
    );
    return result.rows[0] || null;
  },

  // DELETE - Remover usuário
  removerUsuario: async (id) => {
    const result = await pool.query(
      "DELETE FROM usuario WHERE id = $1 RETURNING id, nome, email",
      [id]
    );
    return result.rows[0] || null;
  },
};
