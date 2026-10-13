const pool = require('../database/db');

module.exports = {
  listarUsuarios: async () => {
    const result = await pool.query(
      'SELECT id, nome, email FROM usuario ORDER BY id'
    );
    return result.rows;
  },

  buscarUsuario: async (id) => {
    const result = await pool.query(
      'SELECT * FROM usuario WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  buscarPorEmail: async (email) => {
    const result = await pool.query(
      'SELECT * FROM usuario WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  },

  adicionarUsuario: async ({ nome, email, senha }) => {
    const result = await pool.query(
      `INSERT INTO usuario (nome, email, senha)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email`,
      [nome, email, senha]
    );
    return result.rows[0];
  },

  atualizarUsuario: async (id, dados) => {
    const { nome, email, senha } = dados;

    const result = await pool.query(
      `UPDATE usuario
       SET nome = COALESCE($1, nome),
           email = COALESCE($2, email),
           senha = COALESCE($3, senha)
       WHERE id = $4
       RETURNING id, nome, email`,
      [nome ?? null, email ?? null, senha ?? null, id]
    );

    return result.rows[0] || null;
  },

  removerUsuario: async (id) => {
    const result = await pool.query(
      'DELETE FROM usuario WHERE id = $1 RETURNING id, nome, email',
      [id]
    );
    return result.rows[0] || null;
  },
};