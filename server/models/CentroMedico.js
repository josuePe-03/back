const { Schema, model } = require("mongoose");

const CentroMedicoSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  direccion: {
    type: [String],
    required: true,
  }
});

module.exports = model("CentroMedico", CentroMedicoSchema);
