const { response } = require("express");
const Ubicacion = require("../models/Ubicacion");
const Usuario = require("../models/Usuario");

const { model } = require("mongoose");
const jwt = require("jsonwebtoken");

const crearUbicacion = async (req, res = response) => {
  const { piso, no_sala, centro_medico } = req.body;

  try {
    // Utiliza findOne en lugar de find para buscar una ubicación específica
    const ubicacionEncontrada = await Ubicacion.findOne({
      no_sala: no_sala,
      piso: piso,
      centro_medico: centro_medico,
    });

    // Verifica si la ubicación ya existe
    if (ubicacionEncontrada) {
      return res.status(400).json({
        // Cambia el código de estado a 400 para indicar una solicitud incorrecta
        ok: false,
        msg: "Ya existe la ubicación",
      });
    }

    // Si no se encuentra la ubicación, procede a guardarla
    let ubicacionSave = new Ubicacion({
      piso:piso,
      no_sala:no_sala,
      centro_medico:centro_medico,
      is_delete:false
    });
    await ubicacionSave.save();

    res.status(201).json({
      ok: true,
      ubicacionSave,
      msg: "¡Ubicación agregada con éxito!",
    });
  } catch (error) {
    console.error(error); // Usa console.error para registrar errores
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const obtenerUbicaciones = async (req, res = response) => {

  try {

    //VERIFICACION POR TOKEN
    const token = req.header("x-token");
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);
  
    const usuario = await Usuario.findOne({
      _id: uid,
    });
    
    const ubicaciones = await Ubicacion.find({
      centro_medico:usuario.centro_medico
    });

    //VALIDACION EXISTENCIA
    if (!ubicaciones || ubicaciones.length === 0) {
      return res.json({
        ok: false,
        msg: "Sin ubicaciones existentes",
      });
    }

    const response = {
      ok: true,
      ubicaciones,
    };

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarUbicacion = async (req, res = response) => {
  const ubicacionId = req.params.id;

  try {
    // Intenta encontrar y eliminar el documento por su ID
    await Ubicacion.findByIdAndDelete(ubicacionId);

    res.json({
      ok: true,
      msg: "¡Eliminado Correctamente!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  crearUbicacion,
  obtenerUbicaciones,
  eliminarUbicacion,
};
