const { Prisma } = require("@prisma/client");
const tratarErros = require("../src/middlewares/erro.middleware");
const criarErro = require("../utils/criarErro");

// Um res de mentira: status devolve o próprio res
function criarRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

const req = { method: "GET", url: "/tarefas/99" };

jest.spyOn(console, "error").mockImplementation(() => {});

describe("tratarErros", () => {
  test("responde com o status e a mensagem do erro", () => {
    const erro = criarErro(404, "Tarefa não encontrada");
    const res = criarRes();
    const next = jest.fn();

    tratarErros(erro, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      erro: {
        mensagem: "Tarefa não encontrada",
        detalhes: undefined,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("erro inesperado: responde 500 e registra no console", () => {
    const erro = new Error("Cannot read properties of undefined");
    const res = criarRes();

    tratarErros(erro, req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      erro: {
        mensagem: "Erro interno no servidor",
        detalhes: undefined,
      },
    });
    expect(console.error).toHaveBeenCalled();
  });

  test("erro P2002: responde 409 com o campo duplicado", () => {
    const erro = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed",
      {
        code: "P2002",
        clientVersion: "6.0.0",
        meta: { target: ["email"] },
      },
    );

    const res = criarRes();

    tratarErros(erro, { method: "POST", url: "/usuarios" }, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      erro: {
        mensagem: "Já existe um registro com esse valor",
        detalhes: ["Valor repetido em: email"],
      },
    });
  });
});