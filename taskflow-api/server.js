console.log("TaskFlow API — pronto para o Express!");

// importar express, aplicaçao do express e difinir a porta
const express = require("express");
const app = express();
const PORTA = 3000;

// // primeira rota - GET
// app.get("/", (req, res) => {
//   res.json({ mensagem: "TaskFlow API funcionando!" });
// });

// desafio e rota /tarefas
const tarefas = [
  { id: 1, texto: "Estudar Node", prioridade: "alta", coluna: "afazer" },
  { id: 2, texto: "Bater meta", prioridade: "baixa", coluna: "andamento" },
  { id: 3, texto: "Criar API", prioridade: "média", coluna: "concluido" },
];

app.get("/", (req, res) => {
  res.json({ api: "TaskFlow", versao: "1.0", status: "online" });
});

// app.get("/tarefas", (req, res) => {
//   res.json(tarefas);
// });

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

// A definição da rota não muda — query string é opcional
// GET /tarefas            → retorna todas
// GET /tarefas?coluna=afazer  → só as da coluna afazer
// GET /tarefas?prioridade=alta → só as de alta prioridade
// req.query - parametro de pergunta para filtrar 
//  filtrar tarefas
app.get('/tarefas', (req, res) => {
  // req.query contém os filtros da URL
  const { coluna, prioridade } = req.query;

  // Começar com todas as tarefas
  let resultado = tarefas;

  // Filtrar por coluna se informado
  if (coluna) {
    resultado = resultado.filter(t => t.coluna === coluna);
  }

  // Filtrar por prioridade se informado
  if (prioridade) {
    resultado = resultado.filter(t => t.prioridade === prioridade);
  }

  res.json(resultado);
});

// Rota 404 — DEVE SER A ÚLTIMA
// app.use() captura QUALQUER método e QUALQUER caminho
app.use((req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
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
