function temporizador(req, res, next) {
  const inicio = Date.now();
  res.on("finish", () => {
    const duracao = Date.now() - inicio;
    console.log(`Requisição ${req.method} ${req.url} levou ${duracao}ms`);
  });
  next();
}
module.exports = temporizador;
