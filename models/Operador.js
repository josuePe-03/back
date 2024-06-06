const { Schema, model } = require('mongoose');
const Usuario = require('./Usuario');
const CentroMedico = require('./CentroMedico');

const OperadorSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    apellidos: {
        type: String,
        required: true,
    },
    edad: {
        type: Number,
        required: true
    },
    direccion: {
        type: String,
        required: true,
    },
    unidad_medica: {
        type: String,
        required: true
    },
    is_delete: {
        type: Boolean,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, // Corrección aquí
        ref: Usuario  
    },
    centro_medico: {
        type: Schema.Types.ObjectId, // Corrección aquí
        ref: CentroMedico
    }
});

module.exports = model('Operador', OperadorSchema);