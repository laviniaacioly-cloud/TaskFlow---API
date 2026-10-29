const schemas = {
  Erro: {
    type: "object",
    properties: {
      erro: {
        type: "object",
        properties: {
          mensagem: { type: "string", example: "Tarefa não encontrada" },
          detalhes: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
};

module.exports = { schemas };
