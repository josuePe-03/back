const { Schema, model } = require('mongoose');
const Tecnico = require('./Tecnico');
const Incidencias = require('./Incidencias');
const Equipo = require('./Equipo');

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
    id_tecnicoAsignado: {
        type: String,
        ref: Tecnico,
    },
    id_equipo: {
        type: Schema.Types.ObjectId,
        ref: Equipo,
    },
    fecha_revisado:{
        type: Date,
        required: true,
    },
    fecha_visita: {
        type: Date,
    },
    observacion: {
        type: String,
    },
    estado: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
});

module.exports = model('VisitaIncidencias', VisitaIncidenciasSchema);
