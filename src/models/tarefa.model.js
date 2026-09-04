let tarefas = [
  { id: 1, 
    texto: "Estudar Node", 
    prioridade: "alta", 
    coluna: "afazer",
    usuarioId: 1,
    projetoId: 1,
   },
  { id: 2, 
    texto: "Bater meta", 
    prioridade: "baixa", 
    coluna: "andamento",
    usuarioId: 2,
    projetoId: 2,
  },
  { id: 3, 
    texto: "Criar API", 
    prioridade: "media", 
    coluna: "concluido",
    usuarioId: 3,
    projetoId: 3, 
  },
];

let proximoId = 4;

module.exports = {
  listar: () => tarefas,

  listarPorColuna: (coluna) =>
    tarefas.filter((t) => t.coluna === coluna),

  listarPorUsuario: (usuarioId) =>
    tarefas.filter((t) => t.usuarioId === usuarioId),

  buscar: (id) => tarefas.find((t) => t.id === id),

  adicionar: ({ texto, prioridade, coluna, usuarioId, projetoId }) => {
    const nova = {
      id: proximoId++,
      texto,
      prioridade: prioridade || "media",
      coluna: coluna || "afazer",
      usuarioId,
      projetoId,
    };
    tarefas.push(nova);
    return nova;
  },

  atualizar: (id, dados) => {
    const idx = tarefas.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    tarefas[idx] = { ...tarefas[idx], ...dados, id };
    return tarefas[idx];
  },

  remover: (id) => {
    const idx = tarefas.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    return tarefas.splice(idx, 1)[0];
  },

  estatisticas: () => {
    const total = tarefas.length;
    const porColuna = {
      afazer: tarefas.filter((t) => t.coluna === "afazer").length,
      andamento: tarefas.filter((t) => t.coluna === "andamento").length,
      concluido: tarefas.filter((t) => t.coluna === "concluido").length,
    };
    const porPrioridade = {
      alta: tarefas.filter((tarefa) => tarefa.prioridade === "alta").length,
      media: tarefas.filter((tarefa) => tarefa.prioridade === "media").length,
      baixa: tarefas.filter((tarefa) => tarefa.prioridade === "baixa").length,
    };
    const comMaisTarefas = Object.entries(porColuna).sort((a, b) => b[1] - a[1])
    return {
      total,
      porColuna,
      porPrioridade,
      "Mais Tarefas": comMaisTarefas,
    };
  },

  resumo: () => {
    const total = tarefas.length;
    const afazer = tarefas.filter((t) => t.coluna === "afazer").length;
    const andamento = tarefas.filter((t) => t.coluna === "andamento").length;
    const concluido = tarefas.filter((t) => t.coluna === "concluido").length;
    const prioridades = {
      alta: tarefas.filter((tarefa) => tarefa.prioridades === "alta").length,
      media: tarefas.filter((tarefa) => tarefa.prioridade === "media").length,
      baixa: tarefas.filter((tarefa) => tarefa.prioridade === "baixa").length,
    };
    const prioridadeMaisComum = Object.entries(prioridades).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
    return `Você tem ${total} tarefa(s): ${concluido} concluida(s), ${andamento} em andamento  e ${afazer} a fazer. A prioridade mais comum: ${prioridadeMaisComum}`;
  },
}
