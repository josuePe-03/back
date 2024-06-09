const { Router } = require("express");
const { check } = require("express-validator");

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearVisitaIncidencia, obtenerVisitaIncidencias, obtenerVisitasPorIncidencia, obtenerVisita, visitaProxima, terminarVisita,
} = require("../controllers/visitaIncidencia");
const { validarTecnicos } = require('../middlewares/validar-tecnicos');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );
router.use( validarTecnicos );


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

//Obtener visita
router.put("/terminar-visita/:id", [],terminarVisita);


module.exports = router;
