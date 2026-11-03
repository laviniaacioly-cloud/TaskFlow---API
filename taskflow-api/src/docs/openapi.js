const tarefas = require("./tarefas.docs");
const comum = require("./comum");
const auth = require("./auth.docs");
const prioridades = require("./prioridades.docs");
const usuarios = require("./usuarios.docs");
const projetos = require("./projetos.docs");

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "TaskFlow API",
    version: "1.0.0",
    description: "API do Taskflow - SENAI CTGAS-ER",
  },
  servers: [
  {
    url: process.env.VERCEL
      ? "https://task-flow-api-six.vercel.app"
      : "http://localhost:3000",
    description: process.env.VERCEL ? "Produção" : "Local",
  },
],

  paths: { 
    ...tarefas.paths,
    ...auth.paths,
    ...prioridades.paths,
    ...usuarios.paths,
    ...projetos.paths,
   },

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ...tarefas.schemas,
      ...comum.schemas,
      ...prioridades.schemas,
      ...usuarios.schemas,
      ...projetos.schemas,
    },
  },
};
