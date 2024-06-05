const { response } = require("express");
const Usuario = require("../models/Usuario");
const Operador = require("../models/Operador");
const Tecnico = require("../models/Tecnico");

const jwt = require("jsonwebtoken");

//ADMINISTRADORES
//TECNICOS
const obtenerAdministradores = async (req, res = response) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 4;
    const search = req.query.search || "";

    const administradores = await Usuario.find({
      nombre: { $regex: search, $options: "i" },
      is_delete: false,
      rol: 3,
    })
      .populate("user", {
        email: 1,
      })
      .populate("centro_medico", {
        nombre: 1,
      })
      .skip(page * limit)
      .limit(limit);

    const total = await Usuario.countDocuments({
      nombre: { $regex: search, $options: "i" },
      is_delete: false,
      rol: 3,
    });

    //VALIDACION EXISTENCIA
    if (!administradores || administradores.length === 0) {
      return res.json({
        ok: false,
        msg: "Sin administradores existentes",
      });
    }

    const response = {
      ok: true,
      total,
      page: page + 1,
      limit,
      administradores,
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
const obtenerAdministrador = async (req, res = response) => {
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

//TECNICOS
const obtenerTecnicos = async (req, res = response) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 4;
    const search = req.query.search || "";

    const tecnicos = await Tecnico.find({
      nombre: { $regex: search, $options: "i" },
      is_delete: false,
    })
      .populate("user", {
        email: 1,
      })
      .populate("centro_medico", {
        nombre: 1,
      })
      .skip(page * limit)
      .limit(limit);

    const total = await Tecnico.countDocuments({
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

//OPERADORES
const obtenerOperadores = async (req, res = response) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 4;
    const search = req.query.search || "";

    const operadores = await Operador.find({
      nombre: { $regex: search, $options: "i" },
      is_delete: false,
    })
      .populate("user", {
        email: 1,
      })
      .populate("centro_medico", {
        nombre: 1,
      })
      .skip(page * limit)
      .limit(limit);

    const total = await Operador.countDocuments({
      nombre: { $regex: search, $options: "i" },
      is_delete: false,
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

module.exports = {
  obtenerOperadores,
  obtenerOperador,

  obtenerTecnicos,
  obtenerTecnico,

  obtenerAdministradores,
  obtenerAdministrador,
};
