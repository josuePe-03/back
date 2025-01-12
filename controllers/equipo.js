const { response } = require("express");
const Equipo = require("../models/Equipo");
const { model } = require("mongoose");

const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");

const crearEquipo = async (req, res = response) => {
  const { no_serie, centro_medico } = req.body;

  try {
    const equipoEncontrado = await Equipo.findOne({
      centro_medico: centro_medico,
      no_serie:no_serie,
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
      equipo,
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
    //VERIFICACION POR TOKEN
    const token = req.header("x-token");
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    const usuario = await Usuario.findOne({
      _id: uid,
    });

    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 4;
    const search = req.query.search || "";
    //let sort = req.query.sort || "rating";
    let categoria = req.query.categoria || "All";

    const genreOptions = ["Mastografo", "Tomografo"];

    categoria === "All"
      ? (categoria = [...genreOptions])
      : (categoria = req.query.categoria.split(","));

    const equipos = await Equipo.find({
      centro_medico:usuario.centro_medico,
      modelo: { $regex: search, $options: "i" },
      is_delete: false,
    })
      .where("categoria")
      .in([...categoria])
      .skip(page * limit)
      .limit(limit);

    const total = await Equipo.countDocuments({
      categoria: { $in: [...categoria] },
      modelo: { $regex: search, $options: "i" },
      centro_medico:usuario.centro_medico,
      is_delete: false,
    });

    //VALIDACION EXISTENCIA
    if (!equipos || equipos.length === 0) {
      return res.json({
        ok: false,
        msg: "Sin equipos existentes",
      });
    }

    const response = {
      ok: true,
      total,
      page: page + 1,
      limit,
      categorias: genreOptions,
      equipos,
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
