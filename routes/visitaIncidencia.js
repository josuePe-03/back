const { Router } = require("express");
const { check } = require("express-validator");

//const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearVisitaIncidencia, obtenerVisitaIncidencias, obtenerVisitasPorIncidencia, obtenerVisita, visitaProxima,
} = require("../controllers/visitaIncidencia");

const router = Router();

// Todas tienes que pasar por la validación del JWT
//router.use( validarJWT );

// Crear un nueva visita incidencia
router.post("/agregar-visita", [], crearVisitaIncidencia);

//Obtener visita
router.get("/obtener-visitas", [], obtenerVisitaIncidencias);

//Obtener visita x incidencia
router.get("/obtener-visitas-incidencia/:id", [], obtenerVisitasPorIncidencia);

//Obtener visita
router.get("/obtener-visita/:id", [], obtenerVisita);

//Obtener visita
router.get("/visita-proxima/:id", [],visitaProxima);


module.exports = router;
