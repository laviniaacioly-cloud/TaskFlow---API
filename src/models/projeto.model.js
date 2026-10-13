const pool = require('../database/db');

module.exports = {
  listarProjetos: async () => {
    const result = await pool.query(
      'SELECT * FROM projetos ORDER BY id'
    );
    return result.rows;
  },

  buscarProjeto: async (id) => {
    const result = await pool.query(
      'SELECT * FROM projetos WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  adicionarProjeto: async ({ nome, descricao, ativo }) => {
    const result = await pool.query(
      `INSERT INTO projetos (nome, descricao, ativo)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nome, descricao, ativo ?? true]
    );
    return result.rows[0];
  },

atualizarProjeto: async (id, dados) => {
    const { nome, descricao, ativo } = dados;

    const result = await pool.query(
      `UPDATE projetos
       SET nome = COALESCE($1, nome),
           descricao = COALESCE($2, descricao),
           ativo = COALESCE($3, ativo)
       WHERE id = $4
       RETURNING *`,
      [nome ?? null, descricao ?? null, ativo ?? null, id]
    );

    return result.rows[0] || null;
  },

  removerProjetos: async (id) => {
    const result = await pool.query(
      'DELETE FROM projetos WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0] || null;
  },
};
