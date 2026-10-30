const paths = {
  "/projetos": {
    get: {
      tags: ["Projetos"],
      summary: "Lista todos os projetos",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Lista de projetos",
        },
        500: {
          description: "Erro ao listar projetos",
        },
      },
    },

    post: {
      tags: ["Projetos"],
      summary: "Cadastra um novo projeto",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ProjetoEntrada",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Projeto cadastrado com sucesso",
        },
        400: {
          description: "Nome ou usuário responsável não informado",
        },
        500: {
          description: "Erro ao criar projeto",
        },
      },
    },
  },

  "/projetos/{id}": {
    get: {
      tags: ["Projetos"],
      summary: "Busca um projeto pelo ID",
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
          description: "Projeto encontrado",
        },
        404: {
          description: "Projeto não encontrado",
        },
        500: {
          description: "Erro ao buscar projeto",
        },
      },
    },

    put: {
      tags: ["Projetos"],
      summary: "Atualiza um projeto",
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
              $ref: "#/components/schemas/ProjetoAtualizacao",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Projeto atualizado com sucesso",
        },
        404: {
          description: "Projeto não encontrado",
        },
        500: {
          description: "Erro ao atualizar projeto",
        },
      },
    },

    delete: {
      tags: ["Projetos"],
      summary: "Remove um projeto",
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
          description: "Projeto removido com sucesso",
        },
        404: {
          description: "Projeto não encontrado",
        },
        409: {
          description: "Projeto possui tarefas associadas",
        },
        500: {
          description: "Erro ao remover projeto",
        },
      },
    },
  },

  "/projetos/{id}/resumo": {
    get: {
      tags: ["Projetos"],
      summary: "Consulta o resumo de um projeto",
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
          description: "Resumo do projeto",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ResumoProjeto",
              },
            },
          },
        },
        404: {
          description: "Projeto não encontrado",
        },
        500: {
          description: "Erro ao buscar resumo do projeto",
        },
      },
    },
  },
};

const schemas = {
  Projeto: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      nome: {
        type: "string",
        example: "TaskFlow",
      },
      descricao: {
        type: "string",
        example: "Projeto de gerenciamento de tarefas",
      },
      usuario_id: {
        type: "integer",
        example: 1,
      },
    },
  },

  ProjetoEntrada: {
    type: "object",
    required: ["nome", "usuarioId"],
    properties: {
      nome: {
        type: "string",
        example: "TaskFlow",
      },
      descricao: {
        type: "string",
        example: "Projeto de gerenciamento de tarefas",
      },
      usuarioId: {
        type: "integer",
        example: 1,
      },
    },
  },

  ProjetoAtualizacao: {
    type: "object",
    properties: {
      nome: {
        type: "string",
        example: "TaskFlow atualizado",
      },
      descricao: {
        type: "string",
        example: "Descrição atualizada",
      },
      usuarioId: {
        type: "integer",
        example: 1,
      },
    },
  },

  ResumoProjeto: {
    type: "object",
    properties: {
      projeto: {
        $ref: "#/components/schemas/Projeto",
      },
      totalTarefas: {
        type: "integer",
        example: 10,
      },
      porColuna: {
        type: "object",
        properties: {
          afazer: {
            type: "integer",
            example: 3,
          },
          andamento: {
            type: "integer",
            example: 4,
          },
          concluido: {
            type: "integer",
            example: 3,
          },
        },
      },
    },
  },
};

module.exports = { paths, schemas };
