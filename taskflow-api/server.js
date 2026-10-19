//  CARREGAR VARIÁVEIS DO .ENV
require("dotenv").config();

// CONFIGURAÇÃO DO EXPRESS
const express = require("express");
const cors = require("cors");
const app = express();
const PORTA = process.env.PORTA || 3000;

// IMPORTAR ROTAS
const tarefasRoutes = require("./src/routes/tarefas.routes");
const usuariosRoutes = require("./src/routes/usuarios.routes");
const projetosRoutes = require("./src/routes/projetos.routes");
const authRoutes = require("./src/routes/auth.routes");
const prioridadesRoutes = require("./src/routes/prioridades.routes");

// IMPORTAR MIDDLEWARE DE AUTENTICAÇÃO
const autenticar = require("./src/middlewares/autenticar");

// IMPORTAR MIDDLEWARES
const validarContentType = require("./src/middlewares/validarContentType");
const logger = require("./src/middlewares/logger");
const temporizador = require("./src/middlewares/temporizador");

const tratarErros = require("./src/middlewares/erro.middleware");

const pool = require("./src/database/db");
const criarErro = require("./utils/criarErro");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Erro ao conectar:", err);
  } else {
    console.log("Banco conectado:", res.rows[0].now);
  }
});

// CORS - CONFIGURAÇÃO
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);

// Permite que o Express receba dados em JSON
app.use(express.json());

// MIDDLEWARES
app.use(validarContentType);
app.use(logger);
app.use(temporizador);

//ROTA DE LOGIN
app.use("/auth", authRoutes);

//  ROTA INICIAL DA API
app.get("/", (req, res) => {
  res.json({ api: "TaskFlow", versao: "1.0", status: "online" });
});

// IMPORTAR - USUÁRIOS ROUTER
app.use("/usuarios", usuariosRoutes);

// ROUTER.GET VIRA GET /TAREFAS - TAREFAS ROUTES
app.use("/tarefas", autenticar, tarefasRoutes);

app.use("/projetos", autenticar, projetosRoutes);

app.use("/prioridades", prioridadesRoutes);

app.use ((req, res) => {
  const rota = `${req.method} ${req.url}`;
  throw criarErro(404, `Rota ${rota} não encontrada`);
});

app.use(tratarErros);

// INICIAR O SERVIDOR
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
