const criarErro = require("./criarErro");

function traduzirErroPrisma(erro, metodo = "") {
  if (!erro || !erro.code) {
    return erro;
  }

  // P2002: valor duplicado
  if (erro.code === "P2002") {
    const campos = erro.meta?.target || [];

    return criarErro(
      409,
      "Já existe um registro com esse valor",
      campos.map((campo) => `Valor repetido em: ${campo}`),
    );
  }

  // P2003: violação de chave estrangeira
  if (erro.code === "P2003") {
    if (metodo === "DELETE") {
      return criarErro(
        409,
        "Não é possível excluir: existem registros ligados a este",
      );
    }

    return criarErro(400, "Um dos ids informados não existe");
  }

  // P2001: registro não encontrado
  if (erro.code === "P2001") {
    return criarErro(404, "Registro não encontrado");
  }

  // P2025: registro não encontrado
  if (erro.code === "P2025") {
    return criarErro(404, "Registro não encontrado");
  }

  return erro;
}

module.exports = traduzirErroPrisma;
