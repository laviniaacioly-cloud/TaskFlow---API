// =====================================================
// TASKFLOW API
// =====================================================

console.log("TaskFlow API — pronto para o Express!");

// =====================================================
// 1. CONFIGURAÇÃO DO EXPRESS
// =====================================================
const express = require("express");
const app = express();
const PORTA = 3000;

// Permite que o Express receba dados em JSON
app.use(express.json());

//======================================================
// 2. DADOS INICIAIS
//======================================================
let tarefas = [
  { id: 1, texto: "Estudar Node", prioridade: "alta", coluna: "afazer" },
  { id: 2, texto: "Bater meta", prioridade: "baixa", coluna: "andamento" },
  { id: 3, texto: "Criar API", prioridade: "média", coluna: "concluido" },
];

let proximoId = 4; // começa em 4 pois já temos 3 tarefas

//======================================================
// 3. DADOS DOS USUÁRIOS
//======================================================
let usuario = [
  { id: 1, nome: "admin", email: "admin@taskflow.com", senha: "1234" },
  { id: 2, nome: "lavi", email: "lavi@taskflow.com", senha: "5678" },
  { id: 3, nome: "tony", email: "tony@taskflow.com", senha: "1357" },
];

let proximoIdUsuario = 4; //proximo id dos usuários

// =====================================================
// 4. ROTA INICIAL DA API
// =====================================================
app.get("/", (req, res) => {
  res.json({ api: "TaskFlow", versao: "1.0", status: "online" });
});

//======================================================
// 5. ROTAS DOS USUÀRIOS
//======================================================
// Retorna os usuários - GET
app.get("/usuario", (req, res) => {
  res.json(usuario);
});

// Buscar usuários pelo Id - GET
app.get("/usuario/:id", (req, res) => {
  // req.params.id chega como STRING — converter para número
  const id = Number(req.params.id);
  // Buscar a tarefa no array
  const usuarios = usuario.find((t) => t.id === id);
  // Se não encontrou — retornar 404
  if (!usuarios) {
    return res.status(404).json({ erro: "Usuário não encontrado!" });
  }
  res.json(usuarios);
});

// Adicionar novo usuário - POST
app.post("/usuario", (req, res) => {
  // req.body contém os dados enviados no body da requisição
  const { nome, email, senha } = req.body;

  // DESAFIO: não permitir dois usuários com o mesmo email
  const emailExistente = usuario.find((usuario) => usuario.email === email);

  if (emailExistente) {
    return res.status(404).json({
      erro: "Email já cadastrado! Tente outro.",
    });
  }
  // Criar a nova tarefa com ID gerado pelo servidor
  const novoUsuario = {
    id: proximoIdUsuario++,
    nome: nome,
    email: email,
    senha: senha,
  };

  // Adicionar ao array em memória
  usuario.push(novoUsuario);
  // Retornar a tarefa criada com status 201 Created
  res.status(201).json(novoUsuario);
});

// Atualizar um usuário - PUT
app.put("/usuario/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;

  // Encontrar o índice da tarefa no array
  const indice = usuario.findIndex((t) => t.id === id);

  // Se não encontrou — retornar 404
  if (indice === -1) {
    return res.status(404).json({ erro: "Usuario não encontrada" });
  }

  const emailExistente = usuario.find(
    (usuario) => usuario.email === req.body.email && usuario.id !== id,
  );

  if (emailExistente) {
    return res.status(409).json({
      erro: "Este email já está cadastrado",
    });
  }

  // Substituir a tarefa no array mantendo o mesmo ID
  usuario[indice] = { id, ...req.body };

  // Retornar a tarefa atualizada com status 200
  res.json(usuario[indice]);
});

// // Deletar usuário - DELETE
app.delete("/usuario/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!usuario.find((t) => t.id === id))
    return res.status(404).json({
      erro: "Usuário não encontrado!",
    });

  usuario = usuario.filter((t) => t.id !== id);
  res.json({ mensagem: "Usuário removido com sucesso!", id });
});

//=====================================================
// 6. ROTAS DAS TAREFAS
//=====================================================
// GET /tarefas            → retorna todas
// GET /tarefas?coluna=afazer  → só as da coluna afazer
// GET /tarefas?prioridade=alta → só as de alta prioridade
// req.query - parametro de pergunta para filtrar

app.get("/tarefas", (req, res) => {
  // req.query contém os filtros da URL
  const { coluna, prioridade } = req.query;

  // Começar com todas as tarefas
  let resultado = tarefas;

  // Filtrar por coluna se informado
  if (coluna) {
    resultado = resultado.filter((t) => t.coluna === coluna);
  }

  // Filtrar por prioridade se informado
  if (prioridade) {
    resultado = resultado.filter((t) => t.prioridade === prioridade);
  }

  res.json(resultado);
});

// Encontrar tarefas pelo id - GET
// const coluna = req.query['coluna']

app.get("/tarefas/:id", (req, res) => {
  // req.params.id chega como STRING — converter para número
  const id = Number(req.params.id);

  // Buscar a tarefa no array
  const tarefa = tarefas.find((t) => t.id === id);

  // Se não encontrou — retornar 404
  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }

  // Se encontrou — retornar a tarefa
  res.json(tarefa);
});

// Adicionar uma nova tarefa - POST
app.post("/tarefas", (req, res) => {
  // req.body contém os dados enviados no body da requisição
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
});

// Atualizar tarefas - PUT
app.put("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const { texto, prioridade, coluna } = req.body;
  // Encontrar o índice da tarefa no array
  const indice = tarefas.findIndex((t) => t.id === id);
  // Se não encontrou — retornar 404
  if (indice === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }
  // Substituir a tarefa no array mantendo o mesmo ID
  const tarefaAtualizada = { id, texto, prioridade, coluna };
  tarefas[indice] = tarefaAtualizada;
  // Retornar a tarefa atualizada com status 200
  res.json(tarefaAtualizada);
});

// Deletar tarefas - DELETE
app.delete("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);

  // Verificar se a tarefa existe antes de remover
  const tarefa = tarefas.find((t) => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }

  // Remover do array com filter
  tarefas = tarefas.filter((t) => t.id !== id);
  // filter cria uma cópia do array carregando as tarefas
  // Retornar confirmação da remoção
  res.json({ mensagem: "Tarefa removida com sucesso", id });
});

//======================================
// 7. ROTAS DE ESATATISTICAS
//======================================

app.get("/estatisticas", (req, res) => { 
  // Pegar o filtro da URL
   const { coluna } = req.query; 
    let resultado = tarefas;
     if (coluna) { resultado = resultado.filter( (tarefa) => tarefa.coluna === coluna ); 
    }

  //TOTAL GERAL DE TAREFAS
  const total = resultado.length;
  //TOTAL POR COLUNA
  const porColuna = {
    afazer: resultado.filter((tarefa) => tarefa.coluna === "afazer").length,
    andamento: resultado.filter((tarefa) => tarefa.coluna === "andamento").length,
    concluido: resultado.filter((tarefa) => tarefa.coluna === "concluido").length,
  };

  const porPrioridade = {
    alta: resultado.filter((tarefa) => tarefa.prioridade === "alta").length,
    media: resultado.filter((tarefa) => tarefa.prioridade === "media" || tarefa.prioridade === "média" ).length,
    baixa: resultado.filter((tarefa) => tarefa.prioridade === "baixa").length,
  };

  //COLUNA COM MAIS TAREFAS
  const colunaMaisTarefas = Object.entries(porColuna).sort((a, b) => b[1] - a[1])[0][0];

  //PRIORIDADE MAIS COMUM
  const prioridadeMaisComum = Object.entries(porPrioridade).sort((a, b) => b[1] - a[1])[0][0];

  res.json({
    total,
    porColuna,
    porPrioridade,
    colunaMaisTarefas,
    prioridadeMaisComum,
  });
});

app.get("/estatisticas/resumo", (req, res) => {
  const total = tarefas.length;

  //Contar tarefas por coluna
  const afazer = tarefas.filter((tarefa) => tarefa.coluna === "afazer").length;
  const andamento = tarefas.filter((tarefa) => tarefa.coluna === "andamento",).length;
  const concluido = tarefas.filter((tarefa) => tarefa.coluna === "concluido",).length;

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
});

//=======================================
// 8. Rota 404 — DEVE SER A ÚLTIMA SEMPRE
//=======================================
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
    metodo: req.method,
    caminho: req.url,
  });
});

// 9. INICIAR O SERVIDOR
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});