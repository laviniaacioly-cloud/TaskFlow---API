const prisma = require("../database/prisma");
const criarErro = require("../../utils/criarErro");

module.exports = {
  // GET - Listar usuários
  listarUsuarios: async () => {
    return await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  },

  // GET - Buscar usuário por ID
  buscarUsuario: async (id) => {
    return await prisma.usuario.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });
  },

  // Buscar por e-mail
  // A senha é necessária internamente para validar o login.
  buscarPorEmail: async (email) => {
    return await prisma.usuario.findUnique({
      where: { email },
    });
  },

  // POST - Adicionar usuário
  adicionarUsuario: async ({ nome, email, senha_hash }) => {
    return await prisma.usuario.create({
      data: {
        nome,
        email,
        senha_hash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });
  },

  // PUT - Atualizar usuário
  atualizarUsuario: async (id, dados) => {
    const idNumerico = Number(id);

    const atual = await prisma.usuario.findUnique({
      where: { id: idNumerico },
    });

    if (!atual) {
      return null;
    }

    return await prisma.usuario.update({
      where: { id: idNumerico },
      data: {
        nome: dados.nome ?? atual.nome,
        email: dados.email ?? atual.email,
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });
  },

  // DELETE - Remover usuário
  removerUsuario: async (id) => {
    const idNumerico = Number(id);

    const usuario = await prisma.usuario.findUnique({
      where: { id: idNumerico },
      select: {
        id: true,
        nome: true,
        email: true,
        _count: {
          select: {
            tarefas: true,
            projetos: true,
            comentarios: true,
          },
        },
      },
    });

    if (!usuario) {
      return null;
    }

    const possuiVinculos =
      usuario._count.tarefas > 0 ||
      usuario._count.projetos > 0 ||
      usuario._count.comentarios > 0;

    if (possuiVinculos) {
      throw criarErro(
        409,
        "Não é possível excluir o usuário: existem registros vinculados.",
      );
    }

    return await prisma.usuario.delete({
      where: { id: idNumerico },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });
  },
};
