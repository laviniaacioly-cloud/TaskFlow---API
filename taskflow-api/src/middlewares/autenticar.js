const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {
  // 1. Verificar se o header Authorization foi enviado
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ erro: "Token não informado" });
  // 2. Extrair o token do header
  const token = authHeader.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ erro: "Formato inválido. Use: Bearer <token>" });
  // 3. Verificar a assinatura e a validade
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Injetar dados do usuário na requisição
    req.usuario = payload;

    // 5. Passar para o próximo middleware ou controller
    next();
  } catch (erro) {
    if (erro.name === "TokenExpiredError")
      return res
        .status(401)

        .json({ erro: "Token expirado. Faça login novamente." });

    return res.status(401).json({ erro: "Token inválido." });
  }
}
module.exports = autenticar;
