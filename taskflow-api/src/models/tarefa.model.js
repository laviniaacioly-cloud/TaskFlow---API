const prisma = require("../database/prisma");

const incluirNomes = {
  projetos: {
    select: { nome: true },
  },
  usuario: {
    select: { nome: true },
  },
  prioridades: {
    select: { descricao: true, cor: true },
  },
};

function formatarTarefa(tarefa) {
  const { projetos, usuario, prioridades, ...resto } = tarefa;

  return {
    ...resto,
    projeto: projetos?.nome,
    usuario: usuario?.nome,
    prioridade: prioridades?.descricao,
    prioridade_cor: prioridades?.cor,
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

  // Listar tarefas por coluna usando Prisma
  listarPorColuna: async (coluna) => {
    const result = await prisma.tarefas.findMany({
      where: { coluna },
      include: incluirNomes,
      orderBy: { ordem: "asc" },
    });

    return result.map(formatarTarefa);
  },

  // Listar tarefas por usuário usando Prisma
  listarPorUsuario: async (usuarioId) => {
    const result = await prisma.tarefas.findMany({
      where: { usuario_id: Number(usuarioId) },
      include: incluirNomes,
      orderBy: { id: "asc" },
    });

    return result.map(formatarTarefa);
  },

  // Buscar uma tarefa pelo ID usando Prisma
  buscar: async (id) => {
    const tarefa = await prisma.tarefas.findUnique({
      where: { id },
      include: incluirNomes,
    });

    return tarefa ? formatarTarefa(tarefa) : null;
  },

  adicionar: async ({
    texto,
    prioridade_id,
    prioridade,
    coluna,
    usuarioId,
    usuario_id,
    projetoId,
    projeto_id,
    ordem,
  }) => {
    const prioridadesIds = {
      baixa: 1,
      media: 2,
      alta: 3,
    };

    const prioridadeId = prioridade_id ?? prioridadesIds[prioridade || "media"];

    const usuarioIdFinal = Number(usuario_id ?? usuarioId);
    const projetoIdFinal = Number(projeto_id ?? projetoId);

    // Definir as datas conforme a coluna inicial
    const agora = new Date();

    const iniciadaEm =
      coluna === "andamento" || coluna === "concluido" ? agora : null;

    const concluidaEm = coluna === "concluido" ? agora : null;

    const tarefa = await prisma.tarefas.create({
      data: {
        texto,
        coluna: coluna || "afazer",
        ordem: Number(ordem ?? 0),
        iniciada_em: iniciadaEm,
        concluida_em: concluidaEm,
        prioridades: {
          connect: { id: Number(prioridadeId) },
        },
        usuario: {
          connect: { id: usuarioIdFinal },
        },
        projetos: {
          connect: { id: projetoIdFinal },
        },
      },
      include: incluirNomes,
    });

    return formatarTarefa(tarefa);
  },

  // Atualizar uma tarefa usando Prisma
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
      ordem,
    } = dados;

    const prioridadesIds = {
      baixa: 1,
      media: 2,
      alta: 3,
    };

    const prioridadeId =
      prioridade_id ??
      (prioridade !== undefined ? prioridadesIds[prioridade] : undefined);

    // Buscar a tarefa atual
    const atual = await prisma.tarefas.findUnique({
      where: { id: Number(id) },
    });

    if (!atual) {
      return null;
    }

    // Registrar a data ao entrar em andamento pela primeira vez
    let iniciadaEm = atual.iniciada_em;

    if (coluna === "andamento" && !iniciadaEm) {
      iniciadaEm = new Date();
    }

    // Registrar a data ao concluir e limpar ao reabrir
    let concluidaEm = atual.concluida_em;

    if (coluna === "concluido") {
      if (!concluidaEm) {
        concluidaEm = new Date();
      }
    } else if (coluna === "andamento" || coluna === "afazer") {
      concluidaEm = null;
    }

    // Montar os dados que serão atualizados
    const dadosAtualizados = {
      texto: texto ?? atual.texto,
      prioridade_id:
        prioridadeId !== undefined ? Number(prioridadeId) : atual.prioridade_id,
      coluna: coluna ?? atual.coluna,
      usuario_id: Number(usuario_id ?? usuarioId ?? atual.usuario_id),
      projeto_id: Number(projeto_id ?? projetoId ?? atual.projeto_id),
      ordem: ordem !== undefined ? Number(ordem) : atual.ordem,
      iniciada_em: iniciadaEm,
      concluida_em: concluidaEm,
    };

    // Atualizar usando Prisma e incluir os dados relacionados
    const tarefa = await prisma.tarefas.update({
      where: { id: Number(id) },
      data: dadosAtualizados,
      include: incluirNomes,
    });

    return formatarTarefa(tarefa);
  },

  // Remover uma tarefa usando Prisma
  remover: async (id) => {
    try {
      const tarefa = await prisma.tarefas.delete({
        where: { id: Number(id) },
      });

      return formatarTarefa(tarefa);
    } catch (erro) {
      // P2025 significa que a tarefa não foi encontrada
      if (erro.code === "P2025") {
        return null;
      }

      // Outros erros devem continuar para o tratamento global
      throw erro;
    }
  },

  // Estatísticas das tarefas usando Prisma
  estatisticas: async () => {
    const tarefas = await prisma.tarefas.findMany({
      select: {
        coluna: true,
        prioridades: {
          select: {
            descricao: true,
          },
        },
      },
    });

    const total = tarefas.length;

    const porColuna = {
      afazer: tarefas.filter((t) => t.coluna === "afazer").length,
      andamento: tarefas.filter((t) => t.coluna === "andamento").length,
      concluido: tarefas.filter((t) => t.coluna === "concluido").length,
    };

    const porPrioridade = {
      alta: tarefas.filter((t) => t.prioridades?.descricao === "alta").length,
      media: tarefas.filter((t) => t.prioridades?.descricao === "media").length,
      baixa: tarefas.filter((t) => t.prioridades?.descricao === "baixa").length,
    };

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

  // Resumo das tarefas usando Prisma
  resumo: async () => {
    const tarefas = await prisma.tarefas.findMany({
      select: {
        coluna: true,
        prioridades: {
          select: {
            descricao: true,
          },
        },
      },
    });

    const total = tarefas.length;

    const afazer = tarefas.filter((t) => t.coluna === "afazer").length;

    const andamento = tarefas.filter((t) => t.coluna === "andamento").length;

    const concluido = tarefas.filter((t) => t.coluna === "concluido").length;

    const prioridades = {
      alta: tarefas.filter((t) => t.prioridades?.descricao === "alta").length,
      media: tarefas.filter((t) => t.prioridades?.descricao === "media").length,
      baixa: tarefas.filter((t) => t.prioridades?.descricao === "baixa").length,
    };

    const prioridadeMaisComum = Object.entries(prioridades).sort(
      (a, b) => b[1] - a[1],
    )[0][0];

    return `Você tem ${total} tarefa(s): ${concluido} concluída(s), ${andamento} em andamento e ${afazer} a fazer. A prioridade mais comum: ${prioridadeMaisComum}.`;
  },
};

module.exports = tarefaModel;
