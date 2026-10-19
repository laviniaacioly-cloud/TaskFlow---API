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
};

module.exports = prioridadeModel;