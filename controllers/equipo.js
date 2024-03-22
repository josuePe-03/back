const { response } = require("express");
const Equipo = require("../models/Equipo");

const crearEquipo = async (req, res = response) => {
  const { no_serie } = req.body;

  try {
    const equipoEncontrado = await Equipo.findOne({
      no_serie: no_serie,
      is_delete: false,
    });

    if (equipoEncontrado) {
      return res.status(404).json({
        ok: false,
        msg: "Equipo existe en el sistema",
      });
    }

    let equipo = new Equipo(req.body);
    await equipo.save();

    res.status(201).json({
      ok: true,
      msg: "¡Equipo agregado con exito!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const actualizarEquipo = async (req, res = response) => {
  const equipoId = req.params.id;

  try {
    const equipo = await Equipo.findOne({
      _id: equipoId,
      is_delete: false,
    });

    if (!equipo) {
      return res.status(404).json({
        ok: false,
        msg: "El equipo no existe en el sistema",
      });
    }

    const nuevoEquipo = {
      ...req.body,
    };

    await Equipo.findByIdAndUpdate(equipoId, nuevoEquipo, { new: true });

    res.json({
      ok: true,
      msg: "¡Actualizado Correctamente!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const obtenerEquipos = async (req, res = response) => {
  try {
    const equipos = await Equipo.find({ is_delete: false });
    if (equipos.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Sin equipos existentes",
      });
    }

    res.json({
      ok: true,
      equipos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const obtenerEquipo = async (req, res = response) => {
  const equipoId = req.params.id;

  try {
    const equipo = await Equipo.findOne({
      _id: equipoId,
      is_delete: false,
    });

    if (!equipo) {
      return res.status(404).json({
        ok: false,
        msg: "El equipo no existe en el sistema",
      });
    }

    res.json({
      ok: true,
      equipo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarEquipo = async (req, res = response) => {
  const equipoId = req.params.id;

  try {
    const equipo = await Equipo.findOne({
      _id: equipoId,
      is_delete: false,
    });

    if (!equipo) {
      return res.status(404).json({
        ok: false,
        msg: "El equipo no existe en el sistema",
      });
    }

    await Equipo.findByIdAndUpdate(
      equipoId,
      { is_delete: true },
      { new: true }
    );

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
  crearEquipo,
  actualizarEquipo,
  obtenerEquipos,
  eliminarEquipo,
  obtenerEquipo,
};
