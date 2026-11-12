const criarErro = require("../utils/criarErro");

describe("criarErro", () => {
  test("devolve um error com o status e a mensagem", () => {
    const erro = criarErro(404, "Tarefa não encontrada");

    expect(erro).toBeInstanceOf(Error);
    expect(erro.status).toBe(404);
    expect(erro.message).toBe("Tarefa não encontrada");
  });
  test("criarErro(500) retorna status 500 e detalhes undefined", () => {
    const erro = criarErro(500, "Erro interno no servidor");

    expect(erro.status).toBe(500);
    expect(erro.detalhes).toBeUndefined();
  });
});
