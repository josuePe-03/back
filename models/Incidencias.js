const { Schema, model } = require('mongoose');
const Equipo = require('./Equipo');
const Operador = require('./Operador');
const CentroMedico = require('./CentroMedico');

const IncidenciasSchema = Schema({
    id_equipo: {
        type: Schema.Types.ObjectId,
        ref:Equipo,
        required: true
    },
    id_operador: {
        type: Schema.Types.ObjectId,
        ref: Operador,
        required: true
    },
    tipo_incidencia: {
        type: [String],
        required: true,
    },
    detalle: {
        type: String,
        required: true
    },
    fecha_registrada: {
        type: String,
        required: true,
    },
    status: {
        type: [String],
        required: true
    },
    estado: {
        type: String,
        required: true
    },
    ubicacion: {
        type: String,
        required: true
    },
    is_delete: {
        type: Boolean,
        required: true
    },
    centro_medico: {
        type: Schema.Types.ObjectId, // Corrección aquí
        ref: CentroMedico
    }
});

module.exports = model('Incidencias', IncidenciasSchema);
