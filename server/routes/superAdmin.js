/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  obtenerOperadores,
  obtenerOperador,
  obtenerTecnicos,
  obtenerTecnico,
  obtenerAdministradores,
  obtenerAdministrador,
} = require("../controllers/superAdmin");

const router = Router();

// Todas tienes que pasar por la validación del JWT
//router.use( validarJWT );

//ADMINISTRADORES
router.get("/obtener-administradores", [], obtenerAdministradores);
router.get("/obtener-administrador/:id", [], obtenerAdministrador);

//TECNICOS
router.get("/obtener-tecnicos", [], obtenerTecnicos);
router.get("/obtener-tecnicos/:id", [], obtenerTecnico);

// Operadores
router.get("/obtener-operadores", [], obtenerOperadores);
router.get("/obtener-operador/:id", [], obtenerOperador);

module.exports = router;
