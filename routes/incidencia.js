const { Router } = require("express");
const { check } = require("express-validator");

//const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearIncidencia,
  obtenerIncidencias,
  obtenerIncidencia,
  terminarIncidencia,
} = require("../controllers/incidencias");

const router = Router();

// Todas tienes que pasar por la validación del JWT
//router.use( validarJWT );

// Crear un nueva incidencia
router.post("/agregar-incidencia", [], crearIncidencia);

// Obtener incidencias
router.get("/obtener-incidencias", [], obtenerIncidencias);

// Obtener incidencia
router.get("/obtener-incidencia/:id", [], obtenerIncidencia);

//TERMINAR INCIDENCIA
router.put("/terminar-incidencia/:id", [], terminarIncidencia);


module.exports = router;
