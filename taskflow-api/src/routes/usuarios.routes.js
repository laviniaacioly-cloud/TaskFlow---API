const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");

const validar = require('../middlewares/validar');
const schemas = require('../middlewares/schemas');
const idValido = validar(schemas.id, "params");
const autenticar = require("../middlewares/autenticar");

// LISTAR USUÁRIOS - GET
router.get("/", autenticar, usuariosController.listar);

// BUSCAR PEL ID - GET
router.get("/:id", autenticar, idValido, usuariosController.buscarPorId);

// CRIAR USUÁRIO + VALIDAR EMAIL - POST
router.post("/", validar(schemas.usuario), usuariosController.criar);

// EDITAR USUÁRIO + EMAIL ÚNICO - PUT
router.put("/:id", autenticar, idValido, validar(schemas.usuario), usuariosController.atualizar);

// DELETAR USUÁRIOS - DELETE
router.delete("/:id", autenticar, idValido, usuariosController.remover);

// EXPORTAR ROTAS
module.exports = router;
