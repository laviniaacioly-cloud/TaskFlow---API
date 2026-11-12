function formatarTarefa(tarefa) {
  const { projetos, usuarios, prioridades, ...resto } = tarefa;

  return {
    ...resto,
    projeto: projetos?.nome,
    usuario: usuarios?.nome,
    prioridade: prioridades?.descricao,
    prioridade_cor: prioridades?.cor,
  };
}

module.exports = formatarTarefa;