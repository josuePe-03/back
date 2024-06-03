const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/Usuario");
const Tecnico = require("../models/Tecnico");

const jwt = require("jsonwebtoken");


const crearTecnico = async (req, res = response) => {
  const {
    email,
    password,
    nombre,
    apellidos,
    direccion,
    edad,
    unidad_medica,
    is_delete,
    area,
    centro_medico,
  } = req.body;

  try {
    let usuario = await Usuario.findOne({ email, is_delete: false });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe",
      });
    }

    usuario = new Usuario(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    const usuarioCreate = await usuario.save();

    // Use the _id of usuarioCreate for the Operador document
    let tecnico = new Tecnico({
      _id: usuarioCreate._id, // Use the _id from usuarioCreate
      nombre,
      apellidos,
      direccion,
      edad,
      unidad_medica,
      is_delete,
      area,
      user: usuarioCreate._id,
      centro_medico,
    });
    await tecnico.save();

    res.status(201).json({
      ok: true,
      msg: "¡Tecnico creado con exito!",
      tecnico,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const actualizarTecnico = async (req, res = response) => {
  const tecnicoId = req.params.id;

  try {
    const tecnico = await Tecnico.findOne({ _id: tecnicoId, is_delete: false });

    if (!tecnico) {
      return res.status(404).json({
        ok: false,
        msg: "Tecnico no existe por ese id",
      });
    }

    const nuevoTecnico = {
      ...req.body,
    };

    await Tecnico.findByIdAndUpdate(tecnicoId, nuevoTecnico, { new: true });

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

const obtenerTecnicos = async (req, res = response) => {
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
    let area = req.query.area || "All";

    const genreOptions = ["Mecanico", "Electricista", "General"];

    area === "All"
      ? (area = [...genreOptions])
      : (area = req.query.area.split(","));

    const tecnicos = await Tecnico.find({
      nombre: { $regex: search, $options: "i" },
      is_delete: false,
      centro_medico:usuario.centro_medico,
    })
      .populate("user", {
        email: 1,
      })
      .where("area")
      .in([...area])
      .skip(page * limit)
      .limit(limit);

    const total = await Tecnico.countDocuments({
      area: { $in: [...area] },
      centro_medico:usuario.centro_medico,
      nombre: { $regex: search, $options: "i" },
      is_delete: false,
    });

    //VALIDACION EXISTENCIA
    if (!tecnicos || tecnicos.length === 0) {
      return res.json({
        ok: false,
        msg: "Sin tecnicos existentes",
      });
    }

    const response = {
      ok: true,
      total,
      page: page + 1,
      limit,
      areas: genreOptions,
      tecnicos,
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

const obtenerTecnico = async (req, res = response) => {
  const tecnicoId = req.params.id;

  try {
    const tecnico = await Tecnico.findOne({ _id: tecnicoId, is_delete: false });

    if (!tecnico) {
      return res.status(404).json({
        ok: false,
        msg: "Tecnico no existe por ese id",
      });
    }

    res.json({
      ok: true,
      tecnico,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarTecnico = async (req, res = response) => {
  const tecnicoId = req.params.id;

  try {
    const usuario = await Usuario.findOne({ _id: tecnicoId, is_delete: false });
    const operador = await Tecnico.findOne({
      _id: tecnicoId,
      is_delete: false,
    });

    if (!usuario && !operador) {
      return res.status(404).json({
        ok: false,
        msg: "Tecnico no existe por ese id",
      });
    }

    await Tecnico.findByIdAndUpdate(
      tecnicoId,
      { is_delete: true },
      { new: true }
    );
    await Usuario.findByIdAndUpdate(
      tecnicoId,
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
  crearTecnico,
  actualizarTecnico,
  obtenerTecnicos,
  obtenerTecnico,
  eliminarTecnico,
};
