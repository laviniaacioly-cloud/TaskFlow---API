
function validarContentType(req, res, next) {
  const metodosComBody = ["POST", "PUT", "PATCH"];

  if (metodosComBody.includes(req.method)) {
    const contentType = req.headers["content-type"];
    const tamanho = req.headers["content-length"];
    const temTransferencia = req.headers["transfer-encoding"];

    // Se a requisição não enviou corpo, deixa a validação continuar
    if (
      (tamanho === undefined || tamanho === "0") &&
      !temTransferencia
    ) {
      return next();
    }

    // Se enviou corpo, precisa ser JSON
    if (!contentType || !contentType.includes("application/json")) {
      return res.status(415).json({
        erro: "Content-Type inválido. Use: application/json",
      });
    }
  }

  next();
}

module.exports = validarContentType;
