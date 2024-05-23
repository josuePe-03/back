/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearUbicacion, obtenerUbicaciones, eliminarUbicacion } = require('../controllers/ubicacion');


const router = Router();

// Todas tienes que pasar por la validación del JWT
//router.use( validarJWT );

router.post(
    '/agregar-ubicacion', 
    [ // middlewares
        check('piso', 'El piso es obligatorio').not().isEmpty(),
        check('no_sala', 'El No Piso es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearUbicacion
);

// Obtener tecnicos
router.get(
    '/obtener-ubicaciones', 
    [

    ],
    obtenerUbicaciones
);


 router.delete('/eliminar-ubicacion/:id', eliminarUbicacion);


module.exports = router;