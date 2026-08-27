console.log("TaskFlow API — pronto para o Express!");

// importar express, aplicaçao do express e difinir a porta
const express = require("express");
const app = express();
const PORTA = 3000;

// Permite que o Express receba dados em JSON
app.use(express.json());

// desafio e rota /tarefas
let tarefas = [
  { id: 1, texto: "Estudar Node", prioridade: "alta", coluna: "afazer" },
  { id: 2, texto: "Bater meta", prioridade: "baixa", coluna: "andamento" },
  { id: 3, texto: "Criar API", prioridade: "média", coluna: "concluido" },
];

// ARRAY INICIAL DE USUÁRIOS
let usuario = [
  { id: 1, nome: "admin", email: "admin@taskflow.com", senha: "1234" },
  { id: 2, nome: "lavi", email: "lavi@taskflow.com", senha: "5678" },
  { id: 3, nome: "tony", email: "tony@taskflow.com", senha: "1357" },
];

// lista de usuários
app.get("/usuario", (req, res) => {
  res.json(usuario);
});

// Encontrar usuário por id
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

// adicionar usuário - POST
let proximoIdUsuario = 4;
app.post("/usuario", (req, res) => {
  // req.body contém os dados enviados no body da requisição
  const { nome, email, senha } = req.body;

  // Criar a nova tarefa com ID gerado pelo servidor
  const novoUsuario = {
    id: proximoId++,
    nome: nome,
    email: email,
    senha: senha,
  };

  // Adicionar ao array em memória
  usuario.push(novoUsuario);

  // Retornar a tarefa criada com status 201 Created
  res.status(201).json(novoUsuario);
});

// Atualizar usuario - PUT
app.put("/usuario/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;

  // Encontrar o índice da tarefa no array
  const indice = usuario.findIndex((t) => t.id === id);

  // Se não encontrou — retornar 404
  if (indice === -1) {
    return res.status(404).json({ erro: "Usuario não encontrada" });
  }

  // Substituir a tarefa no array mantendo o mesmo ID
  usuario[indice] = {id, ...req.body};

  // Retornar a tarefa atualizada com status 200
  res.json(usuario[indice]);
});

// // Deletr usuário - DELETE
app.delete('/usuario/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!usuario.find(t => t.id === id)) return res.status(404).json({ erro: 'Não encontrada' });
  usuario = usuario.filter(t => t.id !== id);
  res.json({ mensagem: 'Removida', id });
});


// -------------------------
// TAREFAS
// -------------------------
app.get("/", (req, res) => {
  res.json({ api: "TaskFlow", versao: "1.0", status: "online" });
});

// A definição da rota não muda — query string é opcional
// GET /tarefas            → retorna todas
// GET /tarefas?coluna=afazer  → só as da coluna afazer
// GET /tarefas?prioridade=alta → só as de alta prioridade
// req.query - parametro de pergunta para filtrar
//  filtrar tarefas
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

// encontrar tarefas pelo ID
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

// --------------------------------
// POST
// --------------------------------
// Variável para controlar o próximo ID
let proximoId = 4; // começa em 4 pois já temos 3 tarefas

app.post("/tarefas", (req, res) => {
  // req.body contém os dados enviados no body da requisição
  const { texto, prioridade, coluna, cidade } = req.body;

  // Criar a nova tarefa com ID gerado pelo servidor
  const novaTarefa = {
    id: proximoId++, // usa o ID atual e incrementa
    texto: texto,
    prioridade: prioridade || "media", // valor padrão se não enviado
    coluna: coluna || "afazer",
    cidade: cidade || "",
  };

  // Adicionar ao array em memória
  tarefas.push(novaTarefa);

  // Retornar a tarefa criada com status 201 Created
  res.status(201).json(novaTarefa);
});

// --------------------------------
// PUT
// --------------------------------
// PUT substitui TODOS os campos da tarefa pelo que foi enviado
// Diferente do PATCH que atualiza apenas campos específicos
app.put("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const { texto, prioridade, coluna, cidade } = req.body;

  // Encontrar o índice da tarefa no array
  const indice = tarefas.findIndex((t) => t.id === id);

  // Se não encontrou — retornar 404
  if (indice === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }

  // Substituir a tarefa no array mantendo o mesmo ID
  const tarefaAtualizada = { id, texto, prioridade, coluna, cidade };
  tarefas[indice] = tarefaAtualizada;

  // Retornar a tarefa atualizada com status 200
  res.json(tarefaAtualizada);
});

// Testar no Postman:
// PUT http://localhost:3000/tarefas/1

// -------------------------------------
// DELETE
// -------------------------------------
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

// Rota 404 — DEVE SER A ÚLTIMA
// app.use() captura QUALQUER método e QUALQUER caminho
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
    metodo: req.method,
    caminho: req.url,
  });
});

// iniciar o servidor
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});

// Primeiro teste de rota tarefas
// app.get("/tarefas", (req, res) => {
//   console.log(req.headers);
//     if (req.headers ['tokenpi'] === '597181df-979f-4b06-969c-fe231cc5cec1'){
//         res.json(tarefas);
//     } else {
//         res.status(401).json({erro: 'acesso negado!'})
//     }

// });

// app.get("/tarefas", (req, res) => {
//   res.json(tarefas);
// });

// TESTES
// // res.json() — envia JSON com status 200
// app.get('/ok', (req, res) => {
//   res.json({ status: 'ok', dados: [1, 2, 3] });
// });

// // res.status().json() — status personalizado + JSON
// app.get('/criado', (req, res) => {
//   res.status(201).json({ mensagem: 'Criado com sucesso' });
// });

// // res.status().json() — erro com status 400
// app.get('/erro', (req, res) => {
//   res.status(400).json({ erro: 'Dados inválidos' });
// });

// // res.send() — envia texto puro (menos comum em APIs)
// app.get('/texto', (req, res) => {
//   res.send('Resposta em texto simples');
// });
