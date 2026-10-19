const express = require("express");
const router = express.Router();

const autenticar = require("../middlewares/autenticar");
const tarefasController = require("../controllers/tarefas.controller");

const validar = require("../middlewares/validar");
const schemas = require("../middlewares/schemas");

const idValido = validar(schemas.id, "params");

// GETs - LISTAR TAREFAS
router.get(
  "/",
  validar(schemas.filtroTarefas, "query"),
  tarefasController.listar
);

//  ROTAS DE ESATATISTICAS
router.get("/estatisticas", tarefasController.estatisticas);
router.get("/estatisticas/resumo", tarefasController.resumo);

// CRIAR TAREFA - POST
router.post(
    "/", 
    autenticar, 
    validar(schemas.tarefa), 
    tarefasController.criar
);

// EDITAR TAREFAS - PUT
router.put(
  "/:id",
  idValido,
  validar(schemas.tarefa),
  tarefasController.atualizar
);
// DELETAR TAREFAS - DELETE
router.delete("/:id", idValido, tarefasController.remover);

// BUSCAR POR ID
router.get("/:id", idValido, tarefasController.buscarPorId);

//EXPORTR ROTAS E TAREFAS
module.exports = router;
