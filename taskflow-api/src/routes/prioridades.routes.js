const express = require("express");
const router = express.Router();

const prioridadesController = require("../controllers/prioridades.controller");

// GET - LISTAR TAREFAS POR PRIORIDADE
router.get("/", prioridadesController.listarTodas);

module.exports = router;