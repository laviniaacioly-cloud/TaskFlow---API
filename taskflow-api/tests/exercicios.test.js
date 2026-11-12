const criarErro = require("../utils/criarErro");
const traduzirErroPrisma = require("../utils/traduzirErroPrisma");

describe("Exercício em duplas", () => {

  test("criarErro(500) retorna status 500 e detalhes undefined", () => {
    const erro = criarErro(500, "Erro interno no servidor");

    expect(erro.status).toBe(500);
    expect(erro.detalhes).toBeUndefined();
  });

  test("P2003 ao atualizar (PUT) vira 400", () => {
    const erro = traduzirErroPrisma({ code: "P2003" }, "PUT");

    expect(erro.status).toBe(400);
    expect(erro.message).toBe("Um dos ids informados não existe");
  });

  test("P2025 retorna mensagem de registro não encontrado", () => {
    const erro = traduzirErroPrisma({ code: "P2025" }, "PUT");

    expect(erro.message).toBe("Registro não encontrado");
  });

  test("P2003 ao excluir (DELETE) retorna mensagem correta", () => {
    const erro = traduzirErroPrisma({ code: "P2003" }, "DELETE");

    expect(erro.message).toBe(
      "Não é possível excluir: existem registros ligados a este"
    );
  });

});
