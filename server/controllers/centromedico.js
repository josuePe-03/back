const { response } = require("express");
const CentroMedico = require("../models/CentroMedico");
const { model } = require("mongoose");

const crearCentroMedico = async (req, res = response) => {
  const { nombre } = req.body;

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

    let centroMedico = new CentroMedico(req.body);
    await centroMedico.save();

    res.status(201).json({
      ok: true,
      msg: "¡Equipo agregado con exito!",
      centroMedico,
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
    })
      .skip(page * limit)
      .limit(limit);

    const total = await CentroMedico.countDocuments({
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

module.exports = {
  crearCentroMedico,
  obtenerCentrosMedicos
};
