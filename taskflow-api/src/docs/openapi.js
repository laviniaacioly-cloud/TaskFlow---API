const tarefas = require("./tarefas.docs");
const comum = require("./comum");

module.exports = {
  openapi: "3.0.3",
  info: {
    title: "TaskFlow API",
    version: "1.0.0",
    description: "API do Taskflow - SENAI CTGAS-ER",
  },
  servers: [{ url: "http://localhost:3000", description: "Local" }],

  security: [{ bearerAuth: [] }],

  paths: { ...tarefas.paths },

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
    },
  },
};
