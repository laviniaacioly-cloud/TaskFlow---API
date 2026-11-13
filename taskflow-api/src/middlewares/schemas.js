const schemas = {
  id: {
    id: {
      obrigatorio: true,
      tipo: "inteiro",
    },
  },

  filtroTarefas: {
    usuarioId: {
      obrigatorio: false,
      tipo: "inteiro",
    },
  },

  // POST - CRIAR TAREFA
  tarefa: {
    texto: { obrigatorio: true, tipo: "string" },
    prioridade: {
      obrigatorio: false,
      tipo: "string",
    },
    prioridade_id: {
      obrigatorio: true,
      tipo: "number",
    },
    coluna: {
      obrigatorio: true,
      tipo: "string",
      enum: ["afazer", "andamento", "concluido"],
    },
    usuario_id: { obrigatorio: true, tipo: "number" },
    projeto_id: { obrigatorio: true, tipo: "number" },
  },

  // PUT - ATUALIZAR TAREFA
  tarefaAtualizacao: {
    texto: { obrigatorio: false, tipo: "string" },
    prioridade: {
      obrigatorio: false,
      tipo: "string",
    },
    prioridade_id: {
      obrigatorio: true,
      tipo: "number",
    },
    coluna: {
      obrigatorio: true,
      tipo: "string",
      enum: ["afazer", "andamento", "concluido"],
    },

    usuario_id: { obrigatorio: false, tipo: "number" },
    projeto_id: { obrigatorio: false, tipo: "number" },
    ordem: { obrigatorio: false, tipo: "number" },
  },

  usuario: {
    nome: { obrigatorio: true, tipo: "string", minLength: 3 },
    email: { obrigatorio: true, tipo: "string", formato: "email" },
    senha_hash: { obrigatorio: true, tipo: "string", minLength: 6 },
  },

  projeto: {
    nome: { obrigatorio: true, tipo: "string" },
    descricao: { obrigatorio: false, tipo: "string", maxLength: 200 },
  },

  descricao: {
    obrigatorio: false,
    tipo: "string",
    maxLength: 200,
  },
};

module.exports = schemas;