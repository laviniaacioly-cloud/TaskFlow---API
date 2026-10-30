const paths = {
  "/usuarios": {
    get: {
      tags: ["Usuários"],
      summary: "Lista todos os usuários",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Lista de usuários",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Usuario",
                },
              },
            },
          },
        },
        401: {
          description: "Token não informado ou inválido",
        },
      },
    },

    post: {
      tags: ["Usuários"],
      summary: "Cadastra um novo usuário",
      security: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UsuarioEntrada",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Usuário cadastrado com sucesso",
        },
        400: {
          description: "Dados inválidos",
        },
        409: {
          description: "E-mail já cadastrado",
        },
        500: {
          description: "Erro ao criar usuário",
        },
      },
    },
  },

  "/usuarios/{id}": {
    get: {
      tags: ["Usuários"],
      summary: "Busca um usuário pelo ID",
      security: [{ bearerAuth: [] }],
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
          description: "Usuário encontrado",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Usuario",
              },
            },
          },
        },
        401: {
          description: "Token não informado ou inválido",
        },
        404: {
          description: "Usuário não encontrado",
        },
      },
    },

    put: {
      tags: ["Usuários"],
      summary: "Atualiza um usuário",
      security: [{ bearerAuth: [] }],
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
              $ref: "#/components/schemas/UsuarioEntrada",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Usuário atualizado com sucesso",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Usuario",
              },
            },
          },
        },
        401: {
          description: "Token não informado ou inválido",
        },
        404: {
          description: "Usuário não encontrado",
        },
        409: {
          description: "E-mail já cadastrado",
        },
      },
    },

    delete: {
      tags: ["Usuários"],
      summary: "Remove um usuário",
      security: [{ bearerAuth: [] }],
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
          description: "Usuário removido com sucesso",
        },
        401: {
          description: "Token não informado ou inválido",
        },
        404: {
          description: "Usuário não encontrado",
        },
        409: {
          description: "Existem registros vinculados ao usuário",
        },
      },
    },
  },
};

const schemas = {
  Usuario: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      nome: {
        type: "string",
        example: "Lavinia",
      },
      email: {
        type: "string",
        format: "email",
        example: "lavinia@email.com",
      },
    },
  },

  UsuarioEntrada: {
    type: "object",
    required: ["nome", "email", "senha_hash"],
    properties: {
      nome: {
        type: "string",
        example: "Lavinia",
      },
      email: {
        type: "string",
        format: "email",
        example: "lavinia@email.com",
      },
      senha_hash: {
        type: "string",
        example: "senha123",
      },
    },
  },
};

module.exports = { paths, schemas };
