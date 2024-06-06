const { Schema, model } = require('mongoose');
const VisitaIncidencia = require('./VisitaIncidencia');
const CentroMedico = require('./CentroMedico');

const RefaccionesVisitaSchema = Schema({
    id_visita: {
        type: Schema.Types.ObjectId,
        ref:VisitaIncidencia,
        required: true
    },
    refacciones: {
        type: String,
        required: true
    },
    centro_medico: {
        type: Schema.Types.ObjectId, // Corrección aquí
        ref: CentroMedico
    }
});

module.exports = model('RefaccionesVisita', RefaccionesVisitaSchema);
