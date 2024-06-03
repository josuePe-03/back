const { Schema, model } = require("mongoose");
const CentroMedico = require("./CentroMedico");

const EquipoMedicoSchema = Schema({
  no_serie: { 
    type: String, 
    required: true },
  marca: {
    type: String,
    required: true,
  },
  modelo: {
    type: String,
    required: true,
  },
  categoria: {
    type: [String],
    required: true,
  },
  fecha_fabricacion: {
    type: String,
    required: true,
  },
  fecha_instalacion: {
    type: String,
    required: true,
  },
  fecha_agregado: {
    type: String,
    required: true,
  },
  id_admin: {
    type: String,
    required: true,
  },
  is_delete: {
    type: Boolean,
    required: true,
  },
  centro_medico: {
    type: Schema.Types.ObjectId, // Corrección aquí
    ref: CentroMedico,
  },
});

module.exports = model("EquipoMedico", EquipoMedicoSchema);
