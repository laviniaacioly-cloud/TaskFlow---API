function corsMiddleware(req, res, next) {
  // permitir apenas o dominio específico - frontend
  res.setHeader("Access-Control-Allow-Origin", "http://www.google.com");
  // Métodos permitidos -
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  // Cabeçalhos permitidos
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
}
module.exports = corsMiddleware;
