const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearEquipo,actualizarEquipo,obtenerEquipo,obtenerEquipos,eliminarEquipo } = require('../controllers/equipo');

const router = Router();

// Todas tienes que pasar por la validación del JWT
//router.use( validarJWT );

// Crear un nuevo equipo
router.post(
    '/agregar-equipo',
    [
        check('no_serie','El NO. Serie es obligatorio').not().isEmpty(),
        check('marca','La marca es obligatorio').not().isEmpty(),
        check('modelo','El modelo es obligatorio').not().isEmpty(),
        check('categoria','La categoria es obligatorio').not().isEmpty(),
        check('fecha_instalacion','La fecha de instalacion es obligatorio').not().isEmpty(),
        check('fecha_fabricacion','La fecha de fabricacion es obligatorio').not().isEmpty(),
        check('fecha_agregado','La fecha agregado es obligatorio').not().isEmpty(),
        check('id_admin','La id admin es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearEquipo
);

// Obtener equipo
router.get(
    '/obtener-equipos',
    obtenerEquipos
);

// Obtener equipo por id
router.get(
    '/obtener-equipo/:id',
    obtenerEquipo
);

// Obtener equipo por id
router.put(
    '/actualizar-equipo/:id',
    actualizarEquipo
);

// Obtener equipo por id
router.put(
    '/eliminar-equipo/:id',
    eliminarEquipo
);

module.exports = router;