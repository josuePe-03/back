const { Schema, model } = require('mongoose');
const VisitaIncidencia = require('./VisitaIncidencia');

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
});

module.exports = model('RefaccionesVisita', RefaccionesVisitaSchema);
