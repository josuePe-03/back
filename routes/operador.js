/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { crearOperador,actualizarOperador,obtenerOperadores,eliminarOperador,obtenerOperador } = require('../controllers/operador');


const router = Router();

// Todas tienes que pasar por la validación del JWT
//router.use( validarJWT );

router.post(
    '/agregar-operador', 
    [ // middlewares
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('apellidos', 'Los apellidos son obligatorio').not().isEmpty(),
        check('direccion', 'La direccion es obligatorio').not().isEmpty(),
        check('edad', 'La edad es obligatorio').not().isEmpty(),
        check('unidad_medica', 'La unidad medica es obligatorio').not().isEmpty(),
        check('rol', 'El rol es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearOperador
);

// Actualizar Operadoc
router.put(
    '/actualizar-operador/:id', 
    [

    ],
    actualizarOperador 
);

// Actualizar Operadoc
router.get(
    '/obtener-operadores', 
    [

    ],
    obtenerOperadores
);

// Obtener Operador
router.get(
    '/obtener-operador/:id', 
    [

    ],
    obtenerOperador
);

router.put('/eliminar-operador/:id', eliminarOperador);


module.exports = router;