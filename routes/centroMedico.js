const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { eliminarCentroMedico,crearCentroMedico, obtenerCentrosMedicos, editarCentroMedico, obtenerCentroMedico } = require('../controllers/centromedico');
const { validarSuperAdmin } = require("../middlewares/validar-super-administradores");

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );


// Crear un nuevo equipo
router.post(
    '/crear-centro-medico',
    [
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('telefono','El telefono obligatorio').not().isEmpty(),
        check('direccion','La direccion es obligatorio').not().isEmpty(),
        validarCampos,
        validarSuperAdmin
    ],
    crearCentroMedico
);

// Obtener equipo
router.get(
    '/obtener-centro-medico',
    validarSuperAdmin,
    obtenerCentrosMedicos
);

// Obtener equipo
router.get(
    '/obtener-centro-medico/:id',
    validarSuperAdmin,
    obtenerCentroMedico
);

router.put("/eliminar-centro-medico/:id",validarSuperAdmin, eliminarCentroMedico);

router.put("/editar-centro-medico/:id",validarSuperAdmin, editarCentroMedico);


module.exports = router;