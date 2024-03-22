/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearTecnico,eliminarTecnico, actualizarTecnico, obtenerTecnicos,obtenerTecnico } = require('../controllers/tecnico');


const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );

router.post(
    '/agregar-tecnico', 
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
    crearTecnico
);

// Actualizar Tecnico
router.put(
    '/actualizar-tecnico/:id', 
    [

    ],
    actualizarTecnico 
);

// Obtener tecnicos
router.get(
    '/obtener-tecnicos', 
    [

    ],
    obtenerTecnicos
);

//Obtener tecnico x id
router.get(
    '/obtener-tecnico/:id', 
    [

    ],
    obtenerTecnico
);


//Eliminar tecnicos
router.put('/eliminar-tecnico/:id', eliminarTecnico);


module.exports = router;