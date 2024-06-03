const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const Operador = require("../models/Operador");

const jwt = require("jsonwebtoken");

const crearOperador = async (req, res = response) => {
  const {
    email,
    password,
    nombre,
    apellidos,
    direccion,
    edad,
    unidad_medica,
    is_delete,
    centro_medico,
  } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

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
    let operador = new Operador({
      _id: usuarioCreate._id, // Use the _id from usuarioCreate
      nombre,
      apellidos,
      direccion,
      edad,
      unidad_medica,
      is_delete,
      user: usuarioCreate._id,
      centro_medico,
    });
    await operador.save();

    res.status(201).json({
      ok: true,
      msg: "¡Operador creado con exito!",
      operador,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const actualizarOperador = async (req, res = response) => {
  const operadorId = req.params.id;

  try {
    const operador = await Operador.findOne({
      _id: operadorId,
      is_delete: false,
    });

    if (!operador) {
      return res.status(404).json({
        ok: false,
        msg: "Operador no existe por ese id",
      });
    }

    const nuevoOperador = {
      ...req.body,
    };

    await Operador.findByIdAndUpdate(operadorId, nuevoOperador, { new: true });

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

const obtenerOperadores = async (req, res = response) => {
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

    const operadores = await Operador.find({
      nombre: { $regex: search, $options: "i" },
      is_delete: false,
      centro_medico:usuario.centro_medico,
    })
      .populate("user", {
        email: 1,
      })
      .skip(page * limit)
      .limit(limit);

    const total = await Operador.countDocuments({
      nombre: { $regex: search, $options: "i" },
      is_delete: false,
      centro_medico:usuario.centro_medico,
    });

    //VALIDACION EXISTENCIA
    if (!operadores || operadores.length === 0) {
      return res.json({
        ok: false,
        msg: "Sin operadores existentes",
      });
    }

    const response = {
      ok: true,
      total,
      page: page + 1,
      limit,
      operadores,
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

const obtenerOperador = async (req, res = response) => {
  const operadorId = req.params.id;

  try {
    const operador = await Operador.findOne({
      _id: operadorId,
      is_delete: false,
    });

    if (!operador) {
      return res.status(404).json({
        ok: false,
        msg: "Tecnico no existe por ese id",
      });
    }

    res.json({
      ok: true,
      operador,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarOperador = async (req, res = response) => {
  const operadorId = req.params.id;

  try {
    const usuario = await Usuario.findOne({
      _id: operadorId,
      is_delete: false,
    });

    const operador = await Operador.findOne({
      _id: operadorId,
      is_delete: false,
    });

    if (!usuario && !operador) {
      return res.status(404).json({
        ok: false,
        msg: "Operador no existe por ese id",
      });
    }

    await Operador.findByIdAndUpdate(
      operadorId,
      { is_delete: true },
      { new: true }
    );
    await Usuario.findByIdAndUpdate(
      operadorId,
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
  crearOperador,
  actualizarOperador,
  obtenerOperadores,
  eliminarOperador,
  obtenerOperador,
};
