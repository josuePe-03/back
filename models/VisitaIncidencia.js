const { Schema, model } = require('mongoose');
const Tecnico = require('./Tecnico');
const Incidencias = require('./Incidencias');

const VisitaIncidenciasSchema = Schema({
    id_incidencia: {
        type: Schema.Types.ObjectId,
        ref:Incidencias,
        required: true
    },
    id_tecnico: {
        type: Schema.Types.ObjectId,
        ref: Tecnico,
        required: true
    },
    fecha_revisado:{
        type: String,
        required: true,
    },
    fecha_visita: {
        type: String,
        required: true,
    },
    observacion: {
        type: String,
    },
    estado: {
        type: String,
        required: true,
    },
});

module.exports = model('VisitaIncidencias', VisitaIncidenciasSchema);
