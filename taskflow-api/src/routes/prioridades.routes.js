const express = require("express");
const router = express.Router();

const prioridadesController = require("../controllers/prioridades.controller");

// GET - LISTAR TAREFAS POR PRIORIDADE
router.get("/", prioridadesController.listarTodas);

// POST - CADASTRAR PRIORIDADE
router.post("/", prioridadesController.criar);

// PUT - EDITAR PRIORIDADE
router.put("/:id", prioridadesController.atualizar);

// DELETE - EXCLUIR PRIORIDADE
router.delete("/:id", prioridadesController.excluir);

module.exports = router;