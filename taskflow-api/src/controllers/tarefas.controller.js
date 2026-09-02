let tarefas = [
  { id: 1, texto: "Estudar Node", prioridade: "alta", coluna: "afazer" },
  { id: 2, texto: "Bater meta", prioridade: "baixa", coluna: "andamento" },
  { id: 3, texto: "Criar API", prioridade: "média", coluna: "concluido" },
];

let proximoId = 4;

const tarefasController = {
  // GET - LISTAR TAREFAS
  listar(req, res) {
    const { coluna, prioridade } = req.query;
    let resultado = tarefas;
    if (coluna) resultado = tarefas.filter((t) => t.coluna === coluna);
    if (prioridade)
      resultado = resultado.filter((t) => t.prioridade === prioridade);
    res.json(resultado);
  },

    // ESTATISTICAS
  estatisticas(req, res) {
    const { coluna } = req.query;
    let resultado = tarefas;
    if (coluna) {
      resultado = resultado.filter((tarefa) => tarefa.coluna === coluna);
    }
    //TOTAL GERAL DE TAREFAS
    const total = resultado.length;
    //TOTAL POR COLUNA
    const porColuna = {
      afazer: resultado.filter((tarefa) => tarefa.coluna === "afazer").length,
      andamento: resultado.filter((tarefa) => tarefa.coluna === "andamento")
        .length,
      concluido: resultado.filter((tarefa) => tarefa.coluna === "concluido")
        .length,
    };
    const porPrioridade = {
      alta: resultado.filter((tarefa) => tarefa.prioridade === "alta").length,
      media: resultado.filter(
        (tarefa) =>
          tarefa.prioridade === "media" || tarefa.prioridade === "média",
      ).length,
      baixa: resultado.filter((tarefa) => tarefa.prioridade === "baixa").length,
    };
    //COLUNA COM MAIS TAREFAS
    const colunaMaisTarefas = Object.entries(porColuna).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
    //PRIORIDADE MAIS COMUM
    const prioridadeMaisComum = Object.entries(porPrioridade).sort(
      (a, b) => b[1] - a[1],
    )[0][0];
    res.json({
      total,
      porColuna,
      porPrioridade,
      colunaMaisTarefas,
      prioridadeMaisComum,
    });
  },
  // ESTATISTICAS -> RESUMO
  estatisticasResumo(req, res) {
    const total = tarefas.length;
    //Contar tarefas por coluna
    const afazer = tarefas.filter(
      (tarefa) => tarefa.coluna === "afazer",
    ).length;
    const andamento = tarefas.filter(
      (tarefa) => tarefa.coluna === "andamento",
    ).length;
    const concluido = tarefas.filter(
      (tarefa) => tarefa.coluna === "concluido",
    ).length;

    //Contar tarefas por prioridade
    const prioridades = {
      alta: tarefas.filter((tarefa) => tarefa.prioridade === "alta").length,
      media: tarefas.filter((tarefa) => tarefa.prioridade === "media").length,
      baixa: tarefas.filter((tarefa) => tarefa.prioridade === "baixa").length,
    };

    // Descobrir a prioridade mais comum
    const prioridadeMaisComum = Object.entries(prioridades).sort(
      (a, b) => b[1] - a[1],
    )[0][0];

    //Frase dinamica
    const resumo =
      `Você tem ${total} tarefa(s). ` +
      `${concluido} concluída(s), ` +
      `${andamento} em andamento e ` +
      `${afazer} a fazer. ` +
      `Prioridade mais comum: ${prioridadeMaisComum}.`;

    res.json({
      resumo,
    });
  },
  // GET - BRUSCAR POR ID
  buscarPorId(req, res) {
    const id = Number(req.params.id);
    // Buscar a tarefa no array
    const tarefa = tarefas.find((t) => t.id === id);
    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });
    // Se encontrou — retornar a tarefa
    res.json(tarefa);
  },

  // POST - CRIAR TAREFAS
  criar(req, res) {
    const { texto, prioridade, coluna } = req.body;
    // Criar a nova tarefa com ID gerado pelo servidor
    const novaTarefa = {
      id: proximoId++, // usa o ID atual e incrementa
      texto: texto,
      prioridade: prioridade || "media", // valor padrão se não enviado
      coluna: coluna || "afazer",
    };
    // Adicionar ao array em memória
    tarefas.push(novaTarefa);
    // Retornar a tarefa criada com status 201 Created
    res.status(201).json(novaTarefa);
  },
  // PUT - EDITAR TAREFAS
  atualizar(req, res) {
    const id = Number(req.params.id);
    const { texto, prioridade, coluna } = req.body;
    // Encontrar o índice da tarefa no array
    const indice = tarefas.findIndex((t) => t.id === id);
    // Se não encontrou — retornar 404
    if (indice === -1)
      return res.status(404).json({ erro: "Tarefa não encontrada" });
    // Substituir a tarefa no array mantendo o mesmo ID
    const tarefaAtualizada = { id, texto, prioridade, coluna };
    tarefas[indice] = tarefaAtualizada;
    // Retornar a tarefa atualizada com status 200
    res.json(tarefaAtualizada);
  },
  // DELETE - DELETAR TAREFA
  remover(req, res) {
    const id = Number(req.params.id);
    // Verificar se a tarefa existe antes de remover
    const tarefa = tarefas.find((t) => t.id === id);
    if (!tarefa) return res.status(404).json({ erro: "Tarefa não encontrada" });
    // Remover do array com filter
    tarefas = tarefas.filter((t) => t.id !== id);
    // filter cria uma cópia do array carregando as tarefas
    // Retornar confirmação da remoção
    res.json({ mensagem: "Tarefa removida com sucesso", id });
  },
};
module.exports = tarefasController;