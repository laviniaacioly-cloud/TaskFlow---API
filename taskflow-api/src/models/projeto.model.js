const pool = require("../database/db");
const prisma = require("../database/prisma");

module.exports = {
  // Listar todos os projetos usando Prisma
  listarProjetos: async () => {
    return await prisma.projetos.findMany({
      orderBy: {
        nome: "asc",
      },
    });
  },

  // Buscar um projeto pelo ID usando Prisma
  buscarProjeto: async (id) => {
    const projeto = await prisma.projetos.findUnique({
      where: { id },
    });

    return projeto || null;
  },
  // Adicionar um projeto

  adicionarProjeto: async ({ nome, descricao, usuarioId }) => {
    const result = await pool.query(
      `INSERT INTO projetos (nome, descricao, usuario_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
      [nome, descricao ?? "", usuarioId],
    );

    return result.rows[0];
  },

  // Atualizar um projeto

  atualizarProjeto: async (id, dados) => {
    const projetoAtual = await pool.query(
      "SELECT * FROM projetos WHERE id = $1",
      [id],
    );

    if (projetoAtual.rows.length === 0) return null;

    const atual = projetoAtual.rows[0];

    const result = await pool.query(
      `UPDATE projetos
     SET nome = $1, descricao = $2, usuario_id = $3
     WHERE id = $4
     RETURNING *`,
      [
        dados.nome ?? atual.nome,
        dados.descricao ?? atual.descricao,
        dados.usuarioId ?? atual.usuario_id,
        id,
      ],
    );

    return result.rows[0] || null;
  },

  // Remover um projeto
  removerProjetos: async (id) => {
    const result = await pool.query(
      "DELETE FROM projetos WHERE id = $1 RETURNING *",
      [id],
    );
    return result.rows[0] || null;
  },
};
