const { response } = require("express");
const Ubicacion = require("../models/Ubicacion");
const { model } = require("mongoose");

const crearUbicacion = async (req, res = response) => {
  const { piso, no_sala } = req.body;

  try {
    // Utiliza findOne en lugar de find para buscar una ubicación específica
    const ubicacionEncontrada = await Ubicacion.findOne({
      no_sala: no_sala,
      piso: piso,
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
    let ubicacionSave = new Ubicacion(req.body);
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
    const ubicaciones = await Ubicacion.find({});

    //VALIDACION EXISTENCIA
    if (!ubicaciones || ubicaciones.length === 0) {
      return res.json({
        ok: false,
        msg: "Sin equipos existentes",
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
