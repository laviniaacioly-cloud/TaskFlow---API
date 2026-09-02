const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");

// LISTAR USUÁRIOS - GET
router.get("/", usuariosController.listar);

// BUSCAR PEL ID - GET
router.get("/:id", usuariosController.buscarPorId);

// CRIAR USUÁRIO + VALIDAR EMAIL - POST
router.post("/", usuariosController.criar);

// EDITAR USUÁRIO + EMAIL ÚNICO - PUT
router.put("/:id", usuariosController.atualizar);

// DELETAR USUÁRIOS - DELETE
router.delete("/:id", usuariosController.remover);

// EXPORTAR ROTAS
module.exports = router;
