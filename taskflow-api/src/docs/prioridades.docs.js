
const paths = {
  "/prioridades": {
    get: {
      tags: ["Prioridades"],
      summary: "Lista todas as prioridades",
      security: [],
      responses: {
        200: {
          description: "Lista de prioridades",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Prioridade",
                },
              },
            },
          },
        },
      },
    },

    post: {
      tags: ["Prioridades"],
      summary: "Cadastra uma nova prioridade",
      security: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/PrioridadeEntrada",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Prioridade cadastrada com sucesso",
        },
        400: {
          description: "Dados inválidos",
        },
      },
    },
  },

  "/prioridades/{id}": {
    put: {
      tags: ["Prioridades"],
      summary: "Edita uma prioridade",
      security: [],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/PrioridadeEntrada",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Prioridade atualizada com sucesso",
        },
        400: {
          description: "ID ou dados inválidos",
        },
        404: {
          description: "Prioridade não encontrada",
        },
      },
    },

    delete: {
      tags: ["Prioridades"],
      summary: "Exclui uma prioridade",
      security: [],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: {
            type: "integer",
          },
        },
      ],
      responses: {
        200: {
          description: "Prioridade excluída com sucesso",
        },
        400: {
          description: "ID inválido",
        },
        404: {
          description: "Prioridade não encontrada",
        },
        409: {
          description: "Prioridade utilizada por tarefas",
        },
      },
    },
  },
};

const schemas = {
  Prioridade: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      descricao: {
        type: "string",
        example: "baixa",
      },
      cor: {
        type: "string",
        example: "#0C5F2B",
      },
    },
  },

  PrioridadeEntrada: {
    type: "object",
    required: ["descricao", "cor"],
    properties: {
      descricao: {
        type: "string",
        example: "baixa",
      },
      cor: {
        type: "string",
        example: "#0C5F2B",
        description: "Cor hexadecimal com seis caracteres, incluindo #",
      },
    },
  },
};

module.exports = { paths, schemas };
