const { Schema, model } = require("mongoose");

const ubicacionSchema = Schema({
  piso: {
    type: String,
    required: true,
  },
  no_sala: {
    type: String,
    required: true,
  },
});

module.exports = model("Ubicacion", ubicacionSchema);
