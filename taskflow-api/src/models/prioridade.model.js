const pool = require("../database/db");

const prioridadeModel = {
  // Listar tarefas ordenadas por prioridade
  async listarTarefasPorPrioridade() {
    const result = await pool.query(`
      SELECT
        t.*,
        p.descricao AS prioridade
      FROM tarefas t
      LEFT JOIN prioridades p
        ON p.id = t.prioridade_id
      ORDER BY
        CASE p.descricao
          WHEN 'alta' THEN 1
          WHEN 'media' THEN 2
          WHEN 'baixa' THEN 3
          ELSE 4
        END,
        t.id
    `);

    return result.rows;
  },
  // Listar os níveis de prioridade
  async listarTodas() {
    const result = await pool.query(`
      SELECT id, descricao, cor
      FROM prioridades
      ORDER BY id
    `);

    return result.rows;
  },

  // Cadastrar prioridade
  async criar({ descricao, cor }) {
    const result = await pool.query(
      `INSERT INTO prioridades (descricao, cor, ativo)
       VALUES ($1, $2, TRUE)
       RETURNING id, descricao, cor, ativo`,
      [descricao, cor],
    );

    return result.rows[0];
  },

    // Editar prioridade
  async atualizar(id, { descricao, cor }) {
    const atual = await pool.query(
      `SELECT id, descricao, cor
       FROM prioridades
       WHERE id = $1`,
      [id]
    );

    if (atual.rows.length === 0) {
      return null;
    }

    const prioridadeAtual = atual.rows[0];

    const result = await pool.query(
      `UPDATE prioridades
       SET descricao = $1, cor = $2
       WHERE id = $3
       RETURNING id, descricao, cor, ativo`,
      [
        descricao ?? prioridadeAtual.descricao,
        cor ?? prioridadeAtual.cor,
        id
      ]
    );

    return result.rows[0];
  },

  // Excluir prioridade com segurança
  async excluir(id) {
    // Verifica se a prioridade existe
    const atual = await pool.query(
      `SELECT id FROM prioridades WHERE id = $1`,
      [id]
    );

    if (atual.rows.length === 0) {
      return null;
    }

    // Verifica se alguma tarefa utiliza esta prioridade
    const tarefas = await pool.query(
      `SELECT id
       FROM tarefas
       WHERE prioridade_id = $1
       LIMIT 1`,
      [id]
    );

    if (tarefas.rows.length > 0) {
      return { emUso: true };
    }

    const result = await pool.query(
      `DELETE FROM prioridades
       WHERE id = $1
       RETURNING id, descricao, cor`,
      [id]
    );

    return result.rows[0] || null;
  },
};

module.exports = prioridadeModel;
