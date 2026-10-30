const paths = {
  "/tarefas": {
    get: {
      tags: ["Tarefas"],
      summary: "Listar tarefas",
      description: "Lista tarefas, permitindo filtrar por usuário e/ou coluna.",
      parameters: [
        {
          in: "query",
          name: "usuarioId",
          required: false,
          schema: {
            type: "integer",
          },
          description: "Filtra tarefas pelo ID do usuário",
        },
        {
          in: "query",
          name: "coluna",
          required: false,
          schema: {
            type: "string",
            enum: ["afazer", "andamento", "concluido"],
          },
          description: "Filtra tarefas pela coluna do Kanban",
        },
      ],
      responses: {
        200: {
          description: "Lista de tarefas",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Tarefa",
                },
              },
            },
          },
        },
      },
    },

    post: {
      tags: ["Tarefas"],
      summary: "Cria uma tarefa",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/TarefaEntrada" },
          },
        },
      },
      responses: {
        201: { description: "Tarefa criada" },
        400: { description: "Dados inválidos" },
        401: { description: "Não autenticado" },
      },
    },
  },

  "/tarefas/{id}": {
    get: {
      tags: ["Tarefas"],
      summary: "Busca uma tarefa pelo ID",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: { description: "Tarefa encontrada" },
        400: { description: "ID inválido" },
        404: { description: "Tarefa não encontrada" },
      },
    },

    put: {
      tags: ["Tarefas"],
      summary: "Atualiza uma tarefa",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/TarefaEntrada" },
          },
        },
      },
      responses: {
        200: { description: "Tarefa atualizada" },
        400: { description: "Dados ou ID inválidos" },
        404: { description: "Tarefa não encontrada" },
      },
    },

    delete: {
      tags: ["Tarefas"],
      summary: "Remove uma tarefa",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: { description: "Tarefa removida" },
        400: { description: "ID inválido" },
        404: { description: "Tarefa não encontrada" },
      },
    },
  },

  "/tarefas/estatisticas": {
    get: {
      tags: ["Estatísticas"],
      summary: "Consulta estatísticas das tarefas",
      responses: {
        200: {
          description: "Estatísticas das tarefas",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/EstatisticasTarefas",
              },
            },
          },
        },
      },
    },

    "/tarefas/estatisticas/resumo": {
      get: {
        tags: ["Estatísticas"],
        summary: "Consulta o resumo das tarefas",
        responses: {
          200: {
            description: "Resumo textual das tarefas",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ResumoTarefas",
                },
              },
            },
          },
        },
      },
    },
  },
};

const schemas = {
  Tarefa: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        example: 1,
      },
      texto: {
        type: "string",
        example: "Revisar layout",
      },
      coluna: {
        type: "string",
        enum: ["afazer", "andamento", "concluido"],
      },
      ordem: {
        type: "integer",
        example: 0,
      },
      projeto_id: {
        type: "integer",
        example: 1,
      },
      usuario_id: {
        type: "integer",
        example: 2,
      },
      prioridade_id: {
        type: "integer",
        example: 2,
      },
      criado_em: {
        type: "string",
        format: "date-time",
        example: "2026-10-06T10:55:05.620Z",
      },
      iniciada_em: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
      concluida_em: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
      projeto: {
        type: "string",
        example: "Projeto TaskFlow",
      },
      usuario: {
        type: "string",
        example: "Lavinia",
      },
      prioridade: {
        type: "string",
        example: "media",
      },
      prioridade_cor: {
        type: "string",
        example: "#F5A623",
      },
    },
  },

  EstatisticasTarefas: {
    type: "object",
    properties: {
      total: {
        type: "integer",
        example: 10,
      },
      porColuna: {
        type: "object",
        properties: {
          afazer: { type: "integer", example: 3 },
          andamento: { type: "integer", example: 4 },
          concluido: { type: "integer", example: 3 },
        },
      },
      porPrioridade: {
        type: "object",
        properties: {
          alta: { type: "integer", example: 2 },
          media: { type: "integer", example: 5 },
          baixa: { type: "integer", example: 3 },
        },
      },
      "Mais Tarefas": {
        type: "array",
        description:
          "Lista de colunas e suas quantidades de tarefas, em ordem decrescente.",
        items: {
          type: "array",
          minItems: 2,
          maxItems: 2,
          items: {
            oneOf: [{ type: "string" }, { type: "integer" }],
          },
        },
      },
      rankingUsuarios: {
        type: "array",
        items: {
          type: "object",
          properties: {
            usuarioId: { type: "integer", example: 2 },
            nome: { type: "string", example: "Lavinia" },
            totalTarefas: { type: "integer", example: 5 },
          },
        },
      },
    },
  },

  ResumoTarefas: {
    type: "string",
    example:
      "Você tem 10 tarefa(s): 3 concluída(s), 4 em andamento e 3 a fazer. A prioridade mais comum: media.",
  },

  TarefaEntrada: {
    type: "object",
    required: ["texto", "projeto_id"],
    properties: {
      texto: {
        type: "string",
        example: "Revisar layout",
      },
      prioridade_id: {
        type: "integer",
        example: 2,
      },
      prioridade: {
        type: "string",
        enum: ["alta", "media", "baixa"],
        example: "media",
      },
      coluna: {
        type: "string",
        enum: ["afazer", "andamento", "concluido"],
        example: "afazer",
      },
      projeto_id: {
        type: "integer",
        example: 1,
      },
    },
  },
};

module.exports = { paths, schemas };
