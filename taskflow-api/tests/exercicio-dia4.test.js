const { Prisma } = require("@prisma/client");
const validar = require("../src/middlewares/validar");
const schemas = require("../src/middlewares/schemas");
const tratarErros = require("../src/middlewares/erro.middleware");
const criarErro = require("../utils/criarErro");

function pegarErro(funcao) {
  try {
    funcao();
  } catch (erro) {
    return erro;
  }
}

function criarRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

jest.spyOn(console, "error").mockImplementation(() => {});

describe("Exercícios do Dia 4", () => {
  test("email inválido: retorna 400 e aponta o campo", () => {
    const middleware = validar(schemas.usuario);
    const req = {
      body: {
        nome: "Ana Lima",
        email: "ana@",
        senha_hash: "123456",
      },
    };
    const next = jest.fn();

    const erro = pegarErro(() => middleware(req, {}, next));

    expect(erro.status).toBe(400);
    expect(erro.detalhes).toEqual(["O campo 'email' deve ser um email válido"]);
    expect(next).not.toHaveBeenCalled();
  });

  test("nome e senha curtos: aponta os dois campos", () => {
    const middleware = validar(schemas.usuario);

    const req = {
      body: {
        nome: "Al",
        email: "ana@email.com",
        senha_hash: "123",
      },
    };

    const next = jest.fn();

    const erro = pegarErro(() => middleware(req, {}, next));

    expect(erro.status).toBe(400);
    expect(erro.detalhes).toHaveLength(2);
    expect(next).not.toHaveBeenCalled();
  });

  test("descrição muito longa: aponta o campo", () => {
    const middleware = validar(schemas.projeto);

    const req = {
      body: {
        nome: "Projeto de teste",
        descricao: "a".repeat(201),
      },
    };

    const next = jest.fn();

    const erro = pegarErro(() => middleware(req, {}, next));

    expect(erro.status).toBe(400);
    expect(erro.detalhes).toHaveLength(1);
    expect(erro.detalhes[0]).toContain("descricao");
    expect(next).not.toHaveBeenCalled();
  });

  test("erro 400: retorna mensagem e detalhes", () => {
    const res = criarRes();

    const erro = criarErro(400, "Dados inválidos", [
      "O campo nome é obrigatório",
    ]);

    tratarErros(erro, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);

    expect(res.json).toHaveBeenCalledWith({
      erro: {
        mensagem: "Dados inválidos",
        detalhes: ["O campo nome é obrigatório"],
      },
    });
  });

  test("Prisma P2025: retorna 404", () => {
    const res = criarRes();

    const erro = new Prisma.PrismaClientKnownRequestError(
      "Registro não encontrado",
      {
        code: "P2025",
        clientVersion: "test",
      },
    );

    tratarErros(erro, {}, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);

    expect(res.json).toHaveBeenCalledWith({
      erro: {
        mensagem: "Registro não encontrado",
      },
    });
  });
});