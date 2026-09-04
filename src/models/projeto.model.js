let projetos = [
  {
    id: 1,
    nome: "Projeto Y",
    descricao: "descrição do projeto Y",
    ativo: true,
  },
  {
    id: 2,
    nome: "Projeto X",
    descricao: "descrição do projeto X",
    ativo: true,
  },
  {
    id: 3,
    nome: "Projeto Z",
    descricao: "descrição do projeto Z",
    ativo: true,
  },
];

let proximoProjeto = 4;

module.exports = {
  listarProjetos: () => projetos,

  buscarProjeto: (id) => projetos.find((p) => p.id === id),

  adicionarProjeto: ({ nome, descricao, ativo }) => {
    const novoProjeto = {
      id: proximoProjeto++,
      nome,
      descricao,
      ativo: ativo ?? true,
    };
    projetos.push(novoProjeto);
    return novoProjeto;
  },

  atualizarProjeto: (id, dados) => {
    const idx = projetos.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    projetos[idx] = {
      ...projetos[idx],
      ...dados,
      id,
    };
    return projetos[idx];
  },
  removerProjetos: (id) => {
    const idx = projetos.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    return projetos.splice(idx, 1)[0];
  },
};
