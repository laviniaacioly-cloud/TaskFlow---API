const express = require("express");
const router = express.Router();
const projetosController = require("../controllers/projetos.controller");

const validar = require("../middlewares/validar");
const schemas = require("../middlewares/schemas");

router.get("/", projetosController.listarProjetos);

router.get(
  "/:id/resumo",
  validar(schemas.id, "params"),
  projetosController.resumoProjeto,
);

router.get(
  "/:id",
  validar(schemas.id, "params"),
  projetosController.buscarProjetosId,
);

router.post("/", validar(schemas.projeto), projetosController.criarProjetos);

router.put(
  "/:id",
  validar(schemas.id, "params"),
  validar(schemas.projeto),
  projetosController.atualizarProjetos,
);

router.delete(
  "/:id",
  validar(schemas.id, "params"),
  projetosController.removerProjetos,
);

module.exports = router;
