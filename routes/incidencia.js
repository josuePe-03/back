const { Router } = require("express");
const { check } = require("express-validator");
const multer = require("multer");

const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearIncidencia,
  obtenerIncidencias,
  obtenerIncidencia,
  terminarIncidencia,
} = require("../controllers/incidencias");

const { validarOperadores } = require("../middlewares/validar-operadores");

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use(validarJWT);

// Crear incidencia
router.post(
  "/agregar-incidencia",
  [validarOperadores],
  upload.single("image"),
  crearIncidencia
);

// Obtener incidencias
router.get("/obtener-incidencias", [], obtenerIncidencias);

// Obtener incidencia
router.get("/obtener-incidencia/:id", [], obtenerIncidencia);

//TERMINAR INCIDENCIA
router.put("/terminar-incidencia/:id", [validarOperadores], terminarIncidencia);

module.exports = router;
