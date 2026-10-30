
const paths = {
  "/auth/login": {
    post: {
      tags: ["Autenticação"],
      summary: "Realizar login",
      security: [],
      description: "Autentica o usuário e retorna um token JWT.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "senha_hash"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "usuario@email.com",
                },
                senha_hash: {
                  type: "string",
                  example: "123456",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login realizado com sucesso",
        },
        400: {
          description: "Dados inválidos",
        },
        401: {
          description: "E-mail ou senha incorretos",
        },
      },
    },
  },
};

module.exports = { paths };
