const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const Tecnico = require("../models/Tecnico");

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
    });
    await tecnico.save();

    res.status(201).json({
      ok: true,
      msg: "¡Tecnico creado con exito!",
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
    const tecnicos = await Tecnico.find({ is_delete: false });


    if (tecnicos.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Sin tecnicos existentes",
      });
    }

    res.json({
      ok: true,
      tecnicos,
    });

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
