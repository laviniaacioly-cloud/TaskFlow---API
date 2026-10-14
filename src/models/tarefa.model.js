const pool = require("../database/db");

module.exports = {
  listar: async () => {
    const result = await pool.query("SELECT * FROM tarefas ORDER BY id");
    return result.rows;
  },

  listarPorColuna: async (coluna) => {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE coluna = $1 ORDER BY id",
      [coluna],
    );

    return result.rows;
  },

  listarPorUsuario: async (usuarioId) => {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE usuario_id = $1 ORDER BY id",
      [usuarioId],
    );

    return result.rows;
  },

  buscar: async (id) => {
    const result = await pool.query("SELECT * FROM tarefas WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  },

  adicionar: async (dados) => {
    const { texto, prioridadeId, coluna, usuarioId, projetoId } = dados;

    const result = await pool.query(
      `INSERT INTO tarefas
        (texto, prioridade_id, coluna, usuario_id, projeto_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [texto, prioridadeId, coluna, usuarioId, projetoId],
    );

    return result.rows[0];
  },

  atualizar: async (id, dados) => {
    const { texto, prioridadeId, coluna, usuarioId, projetoId } = dados;

    const result = await pool.query(
      `UPDATE tarefas
     SET texto = $1,
         prioridade_id = $2,
         coluna = $3,
         usuario_id = $4,
         projeto_id = $5,

        iniciada_em = CASE
          WHEN CAST($3 AS varchar) = 'andamento' AND iniciada_em IS NULL
            THEN CURRENT_TIMESTAMP
          ELSE iniciada_em
        END,

        concluida_em = CASE
          WHEN CAST($3 AS varchar) = 'concluido' AND concluida_em IS NULL
            THEN CURRENT_TIMESTAMP
          ELSE concluida_em
        END

     WHERE id = $6
     RETURNING *`,
      [texto, prioridadeId, coluna, usuarioId, projetoId, id],
    );

    return result.rows[0] || null;
  },

  remover: async (id) => {
    const result = await pool.query(
      "DELETE FROM tarefas WHERE id=$1 RETURNING *",
      [id],
    );
    return result.rows[0] || null;
  },

  estatisticas: async () => {
    const totalResult = await pool.query(
      "SELECT COUNT(*) AS total FROM tarefas",
    );

    const colunaResult = await pool.query(
      `SELECT coluna, COUNT(*) AS total
     FROM tarefas
     GROUP BY coluna`,
    );

    const prioridadeResult = await pool.query(
      `SELECT p.descricao, COUNT(t.id) AS total
     FROM prioridades p
     LEFT JOIN tarefas t ON t.prioridade_id = p.id
     GROUP BY p.id, p.descricao`,
    );

    const total = Number(totalResult.rows[0].total);

    const porColuna = {
      afazer: 0,
      andamento: 0,
      concluido: 0,
    };

    colunaResult.rows.forEach((item) => {
      porColuna[item.coluna] = Number(item.total);
    });

    const porPrioridade = {
      alta: 0,
      media: 0,
      baixa: 0,
    };

    prioridadeResult.rows.forEach((item) => {
      porPrioridade[item.descricao] = Number(item.total);
    });

    const comMaisTarefas = Object.entries(porColuna).sort(
      (a, b) => b[1] - a[1],
    );

    return {
      total,
      porColuna,
      porPrioridade,
      "Mais Tarefas": comMaisTarefas,
    };
  },

  resumo: async () => {
    const result = await pool.query(
      `SELECT
       COUNT(*) AS total,
       COUNT(*) FILTER (WHERE t.coluna = 'afazer') AS afazer,
       COUNT(*) FILTER (WHERE t.coluna = 'andamento') AS andamento,
       COUNT(*) FILTER (WHERE t.coluna = 'concluido') AS concluido,
       COUNT(*) FILTER (WHERE p.descricao = 'alta') AS alta,
       COUNT(*) FILTER (WHERE p.descricao = 'media') AS media,
       COUNT(*) FILTER (WHERE p.descricao = 'baixa') AS baixa
     FROM tarefas t
     LEFT JOIN prioridades p ON t.prioridade_id = p.id`,
    );

    const dados = result.rows[0];

    const prioridades = {
      alta: Number(dados.alta),
      media: Number(dados.media),
      baixa: Number(dados.baixa),
    };

    const prioridadeMaisComum = Object.entries(prioridades).sort(
      (a, b) => b[1] - a[1],
    )[0][0];

    return `Você tem ${dados.total} tarefa(s): ${dados.concluido} concluída(s), ${dados.andamento} em andamento e ${dados.afazer} a fazer. A prioridade mais comum: ${prioridadeMaisComum}`;
  },
};
