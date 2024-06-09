const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearCentroMedico, obtenerCentrosMedicos } = require('../controllers/centromedico');
const { validarSuperAdmin } = require("../middlewares/validar-super-administradores");

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );
router.use( validarSuperAdmin );

// Crear un nuevo equipo
router.post(
    '/crear-centro-medico',
    [
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('telefono','El telefono obligatorio').not().isEmpty(),
        check('direccion','La direccion es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearCentroMedico
);

// Obtener equipo
router.get(
    '/obtener-centro-medico',
    obtenerCentrosMedicos
);

module.exports = router;