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
    is_delete: {
        type: Boolean,
        default: false // Valor por defecto
    },
    fecha_creacion: {
        type: String,
        default: () => new Date().toISOString() // Fecha automática en formato ISO
    },
    centro_medico: {
        type: Schema.Types.ObjectId,
        ref: 'CentroMedico' // Ref debe ser el nombre del modelo como string
    }
});

module.exports = model('Usuario', UsuarioSchema);
