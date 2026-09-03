const express = require("express");
const router = express.Router();
const tarefasController = require('../controllers/tarefas.controller');

// app.use(express.json());

// GETs - LISTAR TAREFAS
router.get('/', tarefasController.listar);

// CRIAR TAREFA - POST
router.post('/', tarefasController.criar);

//  ROTAS DE ESATATISTICAS
router.get("/estatisticas", tarefasController.estatisticas);
router.get("/estatisticas/resumo", tarefasController.estatisticasResumo);

// EDITAR TAREFAS - PUT
router.put('/:id', tarefasController.atualizar);

// DELETAR TAREFAS - DELETE
router.delete('/:id', tarefasController.remover);

// BUSCAR POR ID
router.get('/:id', tarefasController.buscarPorId);

//EXPORTR ROTAS E TAREFAS
module.exports = router;
