//  CARREGAR VARIÁVEIS DO .ENV
require('dotenv').config();

// CONFIGURAÇÃO DO EXPRESS
const express = require("express");  
const cors = require('cors');
const app = express();
const PORTA = process.env.PORTA || 3000;

// IMPORTAR ROTAS
const tarefasRoutes = require("./src/routes/tarefas.routes");
const usuariosRoutes = require("./src/routes/usuarios.routes");
const projetosRoutes = require("./src/routes/projetos.routes");
const authRoutes = require('./src/routes/auth.routes');

// IMPORTAR MIDDLEWARES
const validarContentType = require('./src/middlewares/validarContentType');
const logger = require('./src/middlewares/logger');
const temporizador = require('./src/middlewares/temporizador');

// CORS - CONFIGURAÇÃO
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://www.google.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

// Permite que o Express receba dados em JSON
app.use(express.json());

// MIDDLEWARES
app.use(validarContentType);
app.use(logger);
app.use(temporizador);

//ROTA DE LOGIN
app.use('/auth', authRoutes);

//  ROTA INICIAL DA API
app.get("/", (req, res) => {
  res.json({ api: "TaskFlow", versao: "1.0", status: "online" });
});

// IMPORTAR - USUÁRIOS ROUTER
app.use("/usuarios", usuariosRoutes);

// ROUTER.GET VIRA GET /TAREFAS - TAREFAS ROUTES
app.use("/tarefas", tarefasRoutes);

app.use("/projetos", projetosRoutes);

//  Rota 404 — DEVE SER A ÚLTIMA SEMPRE
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
    metodo: req.method,
    caminho: req.url,
  });
});

// INICIAR O SERVIDOR
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});