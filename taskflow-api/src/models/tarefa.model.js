const { estatisticas } = require("../controllers/tarefas.controller");

let tarefas = [
  { id: 1, texto: "Estudar Node", prioridade: "alta", coluna: "afazer" },
  { id: 2, texto: "Bater meta", prioridade: "baixa", coluna: "andamento" },
  { id: 3, texto: "Criar API", prioridade: "media", coluna: "concluido" },
];

let proximoId = 4;

module.exports = {
  listar: () => tarefas,

  listarPorColuna: (coluna) => tarefas.filter((t) => t.coluna === coluna),

  buscar: (id) => tarefas.find((t) => t.id === id),

  adicionar: ({ texto, prioridade, coluna }) => {
    const nova = {
      id: proximoId++,
      texto,
      prioridade: prioridade || "media",
      coluna: coluna || "afazer",
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
      afazer: base.filter((t) => t.coluna === "afazer").length,
      andamento: base.filter((t) => t.coluna === "andamento").length,
      concluido: base.filter((t) => t.coluna === "concluido").length,
    };
    const porPrioridade = {
      alta: tarefas.filter((tarefa) => tarefa.prioridade === "alta").length,
      media: tarefas.filter((tarefa) => tarefa.prioridade === "media").length,
      baixa: tarefas.filter((tarefa) => tarefa.prioridade === "baixa").length,
    };
    const comMaisTarefas = Object.entries(porColuna).sort((a, b) => b[1])[0][0];
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
      alta: tarefas.filter((tarefa) => tarefa.prioridade === "alta").length,
      media: tarefas.filter((tarefa) => tarefa.prioridade === "media").length,
      baixa: tarefas.filter((tarefa) => tarefa.prioridade === "baixa").length,
    };
    const prioridadeMaisComum = Object.entries(prioridade).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
    return `Você tem ${total} tarefa(s): ${concluido} concluida(s), ${andamento} em andamento  e ${afazer} a fazer. A prioridade mais commum: ${prioridadeMaisComum}`;
  },
};
