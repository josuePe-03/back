const { response } = require("express");
const Incidencias = require("../models/Incidencias");

const crearIncidencia = async (req, res = response) => {
  try {
    let incidencia = new Incidencias(req.body);
    await incidencia.save();

    res.status(201).json({
      ok: true,
      msg: "¡Incidencia agregada con exito!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const obtenerIncidencias = async (req, res = response) => {
  try {
    const incidencias = await Incidencias.find()
      .populate("id_equipo", {
        no_serie: 1,
        marca: 1,
        modelo: 1,
      })
      .populate("id_operador", {
        nombre: 1,
        apellidos: 1,
        unidad_medica: 1,
      });

    res.json({
      ok: true,
      incidencias,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const obtenerIncidencia = async (req, res = response) => {
  const equipoId = req.params.id;

  try {
    const incidencia = await Incidencias.find({
      id_equipo: equipoId,
    })
      .populate("id_equipo", {
        no_serie: 1,
        marca: 1,
        modelo: 1,
      })
      .populate("id_operador", {
        nombre: 1,
        apellidos: 1,
        unidad_medica: 1,
      });

    if (!equipoId) {
      return res.status(404).json({
        ok: false,
        msg: "La incidencia no existe en el sistema",
      });
    }

    res.json({
      ok: true,
      incidencia,
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
  crearIncidencia,
  obtenerIncidencias,
  obtenerIncidencia,
};
