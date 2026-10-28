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
      where: { id: Number(id) },
    });

    return projeto || null;
  },

  // Adicionar um projeto usando Prisma
  adicionarProjeto: async ({ nome, descricao, usuarioId }) => {
    return await prisma.projetos.create({
      data: {
        nome,
        descricao: descricao ?? "",
        usuario_id: Number(usuarioId),
      },
    });
  },

  // Atualizar um projeto usando Prisma
  atualizarProjeto: async (id, dados) => {
    const idNumerico = Number(id);

    const atual = await prisma.projetos.findUnique({
      where: { id: idNumerico },
    });

    if (!atual) {
      return null;
    }

    return await prisma.projetos.update({
      where: { id: idNumerico },
      data: {
        nome: dados.nome ?? atual.nome,
        descricao: dados.descricao ?? atual.descricao,
        usuario_id: Number(
          dados.usuario_id ?? dados.usuarioId ?? atual.usuario_id,
        ),
      },
    });
  },

  // Remover um projeto usando Prisma
  removerProjetos: async (id) => {
    try {
      return await prisma.projetos.delete({
        where: { id: Number(id) },
      });
    } catch (erro) {
      // P2025 significa que o projeto não foi encontrado
      if (erro.code === "P2025") {
        return null;
      }

      // Outros erros serão tratados pelo middleware global
      throw erro;
    }
  },
};
