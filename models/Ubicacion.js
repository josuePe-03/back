const { Schema, model } = require("mongoose");
const CentroMedico = require('./CentroMedico');

const ubicacionSchema = Schema({
  piso: {
    type: String,
    required: true,
  },
  no_sala: {
    type: String,
    required: true,
  },
  centro_medico: {
    type: Schema.Types.ObjectId, // Corrección aquí
    ref: CentroMedico
}
});

module.exports = model("Ubicacion", ubicacionSchema);
