const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
    is_delete:{
        type:Boolean,
        required:true
    },
    fecha_creacion:{
        type: String,
        required: true
    }
});


module.exports = model('Usuario', UsuarioSchema );

