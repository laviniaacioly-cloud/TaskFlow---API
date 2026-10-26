const pool = require("../database/db");
const prisma = require("../database/prisma");

const incluirNomes = {
  prioridades: {
    select: {
      descricao: true,
      cor: true,
    },
  },
  projetos: {
    select: {
      nome: true,
    },
  },
  usuario: {
    select: {
      nome: true,
    },
  },
};

function formatarTarefa(tarefa) {
  const { prioridades, projetos, usuario, ...resto } = tarefa;

  return {
    ...resto,
    prioridade: prioridades?.descricao,
    cor: prioridades?.cor,
    projeto: projetos?.nome,
    usuario: usuario?.nome,
  };
}

const tarefaModel = {
  // Listar todas as tarefas usando Prisma
  listar: async () => {
    const result = await prisma.tarefas.findMany({
      include: incluirNomes,
      orderBy: {
        id: "asc",
      },
    });

    return result.map(formatarTarefa);
  },

  // Listar tarefas por coluna
  listarPorColuna: async (coluna) => {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE coluna = $1 ORDER BY ordem",
      [coluna],
    );

    return result.rows;
  },

  // Listar tarefas por usuário
  listarPorUsuario: async (usuarioId) => {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE usuario_id = $1 ORDER BY id",
      [usuarioId],
    );

    return result.rows;
  },

  // Buscar uma tarefa pelo ID
  buscar: async (id) => {
    const result = await pool.query("SELECT * FROM tarefas WHERE id = $1", [
      id,
    ]);

    return result.rows[0] || null;
  },

  // Adicionar uma tarefa
  adicionar: async ({
    texto,
    prioridade_id,
    prioridade,
    coluna,
    usuario_id,
    usuarioId,
    projeto_id,
    projetoId,
  }) => {
    const prioridadesIds = {
      baixa: 1,
      media: 2,
      alta: 3,
    };

    const prioridadeId = prioridade_id ?? prioridadesIds[prioridade || "media"];

    const usuarioIdFinal = usuario_id ?? usuarioId;
    const projetoIdFinal = projeto_id ?? projetoId;

    const result = await pool.query(
      `INSERT INTO tarefas
       (texto, prioridade_id, coluna, usuario_id, projeto_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [texto, prioridadeId, coluna || "afazer", usuarioIdFinal, projetoIdFinal],
    );

    return result.rows[0];
  },

  // Atualizar uma tarefa
  atualizar: async (id, dados) => {
    const {
      texto,
      prioridade,
      prioridade_id,
      coluna,
      usuarioId,
      usuario_id,
      projetoId,
      projeto_id,
    } = dados;

    const prioridadesIds = {
      baixa: 1,
      media: 2,
      alta: 3,
    };

    const prioridadeId =
      prioridade_id ??
      (prioridade !== undefined ? prioridadesIds[prioridade] : undefined);

    const usuarioIdFinal = usuario_id ?? usuarioId;
    const projetoIdFinal = projeto_id ?? projetoId;

    const tarefaAtual = await pool.query(
      "SELECT * FROM tarefas WHERE id = $1",
      [id],
    );

    if (tarefaAtual.rows.length === 0) {
      return null;
    }

    const atual = tarefaAtual.rows[0];

    // Registra a data ao entrar em andamento pela primeira vez
    let iniciadaEm = atual.iniciada_em;
    if (coluna === "andamento" && !iniciadaEm) {
      iniciadaEm = new Date();
    }

    // Registra a data ao concluir e limpa ao reabrir a tarefa
    let concluidaEm = atual.concluida_em;

    if (coluna === "concluido") {
      if (!concluidaEm) {
        concluidaEm = new Date();
      }
    } else if (coluna === "andamento" || coluna === "afazer") {
      concluidaEm = null;
    }

    const result = await pool.query(
      `UPDATE tarefas
       SET texto = $1,
           prioridade_id = $2,
           coluna = $3,
           usuario_id = $4,
           projeto_id = $5,
           iniciada_em = $6,
           concluida_em = $7
       WHERE id = $8
       RETURNING *`,
      [
        texto ?? atual.texto,
        prioridadeId ?? atual.prioridade_id,
        coluna ?? atual.coluna,
        usuarioIdFinal ?? atual.usuario_id,
        projetoIdFinal ?? atual.projeto_id,
        iniciadaEm,
        concluidaEm,
        id,
      ],
    );

    return result.rows[0] || null;
  },

  // Remover uma tarefa
  remover: async (id) => {
    const result = await pool.query(
      "DELETE FROM tarefas WHERE id = $1 RETURNING *",
      [id],
    );

    return result.rows[0] || null;
  },

  // Estatísticas das tarefas
  estatisticas: async () => {
    const result = await pool.query(`
    SELECT
      COUNT(*)::int AS total,
      COUNT(*) FILTER (WHERE t.coluna = 'afazer')::int AS afazer,
      COUNT(*) FILTER (WHERE t.coluna = 'andamento')::int AS andamento,
      COUNT(*) FILTER (WHERE t.coluna = 'concluido')::int AS concluido,
      COUNT(*) FILTER (WHERE p.descricao = 'alta')::int AS alta,
      COUNT(*) FILTER (WHERE p.descricao = 'media')::int AS media,
      COUNT(*) FILTER (WHERE p.descricao = 'baixa')::int AS baixa
    FROM tarefas t
    LEFT JOIN prioridades p ON p.id = t.prioridade_id
    `);

    const dados = result.rows[0];

    const porColuna = {
      afazer: dados.afazer,
      andamento: dados.andamento,
      concluido: dados.concluido,
    };

    const porPrioridade = {
      alta: dados.alta,
      media: dados.media,
      baixa: dados.baixa,
    };

    const comMaisTarefas = Object.entries(porColuna).sort(
      (a, b) => b[1] - a[1],
    );

    return {
      total: dados.total,
      porColuna,
      porPrioridade,
      "Mais Tarefas": comMaisTarefas,
    };
  },

  // Resumo das tarefas
  resumo: async () => {
    const result = await pool.query(`
      SELECT
        COUNT(*)::int AS total,
        COUNT(*) FILTER (WHERE t.coluna = 'afazer')::int AS afazer,
        COUNT(*) FILTER (WHERE t.coluna = 'andamento')::int AS andamento,
        COUNT(*) FILTER (WHERE t.coluna = 'concluido')::int AS concluido,
        COUNT(*) FILTER (WHERE p.descricao = 'alta')::int AS alta,
        COUNT(*) FILTER (WHERE p.descricao = 'media')::int AS media,
        COUNT(*) FILTER (WHERE p.descricao = 'baixa')::int AS baixa
      FROM tarefas t
      LEFT JOIN prioridades p ON p.id = t.prioridade_id
    `);

    const dados = result.rows[0];

    const prioridades = {
      alta: dados.alta,
      media: dados.media,
      baixa: dados.baixa,
    };

    const prioridadeMaisComum = Object.entries(prioridades).sort(
      (a, b) => b[1] - a[1],
    )[0][0];

    return `Você tem ${dados.total} tarefa(s): ${dados.concluido} concluída(s), ${dados.andamento} em andamento e ${dados.afazer} a fazer. A prioridade mais comum: ${prioridadeMaisComum}.`;
  },
};

module.exports = tarefaModel;
