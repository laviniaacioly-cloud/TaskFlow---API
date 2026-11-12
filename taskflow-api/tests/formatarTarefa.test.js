 const formatarTarefa = require("../utils/formatarTarefa");

function tarefaDoPrisma() {
  return {
    id: 1,
    texto: "Definir tabelas do banco",
    coluna: "afazer",
    projetos: { nome: "Taskflow" },
    usuarios: { nome: "Ana Lima" },
    prioridades: { descricao: "Alto", cor: "#EF4444" },
  };
}

test("achata as relaçções no formato que o front espera", () => {
  const resultado = formatarTarefa(tarefaDoPrisma());
  expect(resultado).toEqual({
    id: 1,
    texto: "Definir tabelas do banco",
    coluna: "afazer",
    projeto: "Taskflow",
    usuario: "Ana Lima",
    prioridade: "Alto",
    prioridade_cor: "#EF4444",
  });
});

test("deixa o campo undefined quando a relação não veio", () => {
  const tarefa = tarefaDoPrisma();
  delete tarefa.prioridades;
  const resultado = formatarTarefa(tarefa);
  expect(resultado.prioridade).toBeUndefined();
  expect(resultado.projeto).toBe("Taskflow");
});

test("não altera a tarefa original", () => {
  const tarefa = tarefaDoPrisma();
  const resultado = formatarTarefa(tarefa);
  expect(resultado).not.toBe(tarefa);
  expect(tarefa).toHaveProperty("projetos", { nome: "Taskflow" });
});

test("lança TypeError se receber null", () => {
  expect(() => formatarTarefa(null)).toThrow(TypeError);
});
