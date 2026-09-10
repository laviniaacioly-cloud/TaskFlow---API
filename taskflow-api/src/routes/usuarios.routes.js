const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");

const validar = require('../middlewares/validar');
const schemas = require('../middlewares/schemas');

// LISTAR USUÁRIOS - GET
router.get("/", usuariosController.listar);

// BUSCAR PEL ID - GET
router.get("/:id", usuariosController.buscarPorId);

// CRIAR USUÁRIO + VALIDAR EMAIL - POST
router.post("/", validar(schemas.usuario), usuariosController.criar);

// EDITAR USUÁRIO + EMAIL ÚNICO - PUT
router.put("/:id", validar(schemas.usuario), usuariosController.atualizar);

// DELETAR USUÁRIOS - DELETE
router.delete("/:id", usuariosController.remover);

// EXPORTAR ROTAS
module.exports = router;
