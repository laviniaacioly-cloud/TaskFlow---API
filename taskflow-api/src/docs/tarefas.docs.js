const paths = {
  "/tarefas": {
    get: {
      tags: ["Tarefas"],
      summary: "Lista todas as tarefas",
      parameters: [
        {
          name: "usuarioId",
          in: "query",
          required: false,
          schema: { type: "integer" },
          description: "Filtra tarefas pelos usuários",
        },
      ],
      responses: {
        200: {
          description: "Lista de tarefas",
        },
        400: {
          description: "Parâmetros inválidos",
        },
        401: {
          description: "Token não informado ou inválido",
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
    "/tarefas/estatisticas": {
      get: {
        tags: ["Estatísticas"],
        summary: "Consulta estatísticas das tarefas",
        responses: {
          200: { description: "Estatísticas retornadas" },
        },
      },
    },

    "/tarefas/estatisticas/resumo": {
      get: {
        tags: ["Estatísticas"],
        summary: "Consulta o resumo das tarefas",
        responses: {
          200: { description: "Resumo retornado" },
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
      iniciada_em: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
    },
  },
  TarefaEntrada: {
    type: "object",
    required: ["texto"],
    properties: {
      texto: {
        type: "string",
        example: "Revisar layout",
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
      usuarioId: {
        type: "number",
        example: 2,
      },
    },
  },
};

module.exports = { paths, schemas };
