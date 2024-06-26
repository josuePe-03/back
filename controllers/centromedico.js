const { response } = require("express");

const CentroMedico = require("../models/CentroMedico");
const Usuario = require("../models/Usuario");
const Operador = require("../models/Operador");
const Tecnico = require("../models/Tecnico");
const Equipo = require("../models/Equipo");
const Incidencias = require("../models/Incidencias");
const VisitaIncidencia = require("../models/VisitaIncidencia");
const Ubicacion = require("../models/Ubicacion");
const RefaccionesVisita = require("../models/RefaccionesVisita");

const bcrypt = require("bcryptjs");

const crearCentroMedico = async (req, res = response) => {
  const { nombre, fecha_creacion, telefono, direccion } = req.body;

  const passwordTemporal = "123456";
  try {
    const CentroMedicoEncontrado = await CentroMedico.findOne({
      nombre: nombre,
    });

    if (CentroMedicoEncontrado) {
      return res.status(404).json({
        ok: false,
        msg: "Centro Medico ya existe en el sistema",
      });
    }

    let centroMedico = new CentroMedico({
      telefono: telefono,
      direccion: direccion,
      nombre: nombre,
      is_delete: false,
    });
    await centroMedico.save();

    //CREACION DE ADMINISTRADOR DE CENTRO MEDICO

    const nombreSinEspacions = nombre.replace(/\s/g, "");

    let usuario = new Usuario({
      nombre: nombre,
      email: "admin" + nombreSinEspacions + "@example.com",
      is_delete: false,
      rol: 3,
      fecha_creacion: fecha_creacion,
      centro_medico: centroMedico._id,
    });

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(passwordTemporal, salt);

    await usuario.save();

    res.status(201).json({
      ok: true,
      msg: "¡Centro medico agregado con exito!",
      centroMedico,
      usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const obtenerCentrosMedicos = async (req, res = response) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 4;
    const search = req.query.search || "";

    const centroMedico = await CentroMedico.find({
      nombre: { $regex: search, $options: "i" },
      is_delete:false
    })
      .skip(page * limit)
      .limit(limit);

    const total = await CentroMedico.countDocuments({
      is_delete:false,
      nombre: { $regex: search, $options: "i" },
    });

    //VALIDACION EXISTENCIA
    if (!centroMedico || centroMedico.length === 0) {
      return res.json({
        ok: false,
        msg: "Sin centros medicos existentes",
      });
    }

    const response = {
      ok: true,
      total,
      page: page + 1,
      limit,
      centroMedico,
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

const obtenerCentroMedico = async (req, res = response) => {
  const centroMedicoId = req.params.id;

  try {
    const centroMedico = await CentroMedico.findOne({
      _id: centroMedicoId,
      is_delete: false,
    });

    if (!centroMedico) {
      return res.status(404).json({
        ok: false,
        msg: "Centro Medico no existe por ese id",
      });
    }


    const response = {
      ok: true,
      centroMedico
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

const editarCentroMedico = async (req, res = response) => {
  const centroMedicoId = req.params.id;

  try {
    const centroMedico = await CentroMedico.findOne({
      _id: centroMedicoId,
      is_delete: false,
    });

    if (!centroMedico) {
      return res.status(404).json({
        ok: false,
        msg: "Centro Medico no existe por ese id",
      });
    }

    const nuevosDatos = {
      ...req.body,
    };

    let centroMedicoActualizado = await CentroMedico.findByIdAndUpdate(
      centroMedicoId,
      nuevosDatos,
      { new: true }
    );

    const response = {
      ok: true,
      centroMedicoActualizado,
      msg:"Centro medico editado con exito"
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

const eliminarCentroMedico = async (req, res = response) => {
  const centroMedicoId = req.params.id;

  try {
    const centroMedico = await CentroMedico.findOne({
      _id: centroMedicoId,
      is_delete: false,
    });

    if (!centroMedico) {
      return res.status(404).json({
        ok: false,
        msg: "Centro Medico no existe por ese id",
      });
    }

    await Usuario.updateMany(
      { centro_medico: centroMedicoId },
      { is_delete: true },
      { new: true }
    );

    await CentroMedico.updateMany(
      { _id: centroMedicoId },
      { is_delete: true },
      { new: true }
    );

    await Operador.updateMany(
      { centro_medico: centroMedicoId },
      { is_delete: true },
      { new: true }
    );

    await Tecnico.updateMany(
      { centro_medico: centroMedicoId },
      { is_delete: true },
      { new: true }
    );

    await Ubicacion.updateMany(
      { centro_medico: centroMedicoId },
      { is_delete: true },
      { new: true }
    );

    await Incidencias.updateMany(
      { centro_medico: centroMedicoId },
      { is_delete: true },
      { new: true }
    );

    await RefaccionesVisita.updateMany(
      { centro_medico: centroMedicoId },
      { is_delete: true },
      { new: true }
    );

    await VisitaIncidencia.updateMany(
      { centro_medico: centroMedicoId },
      { is_delete: true },
      { new: true }
    );

    const response = {
      ok: true,
      msg: "Eliminado con exito",
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
module.exports = {
  editarCentroMedico,
  crearCentroMedico,
  eliminarCentroMedico,
  obtenerCentrosMedicos,
  obtenerCentroMedico
};
