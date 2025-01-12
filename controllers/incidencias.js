const { response } = require("express");
const { Resend } = require("resend");

const Incidencias = require("../models/Incidencias");
const Operador = require("../models/Operador");

const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");

const resend = new Resend(process.env.KEY_RESEND);

const crearIncidencia = async (req, res = response) => {
  const {
    id_operador,
    detalle,
    id_equipo,
    status,
    ubicacion,
    fecha_registrada,
    tipo_incidencia,
    centro_medico
  } = req.body;

  try {
    //OBTENER CORREO DEL OPERADOR
    const usuario = await Operador.findOne({
      _id: id_operador,
    }).populate({
      path: "user",
      select: { email: 1 },
    });

    let incidencia = new Incidencias({
      id_equipo:id_equipo,
      id_operador:id_operador,
      tipo_incidencia:tipo_incidencia,
      detalle:detalle,
      fecha_registrada:fecha_registrada,
      status:status,
      estado:"Pendiente",
      ubicacion:ubicacion,
      is_delete:false,
      centro_medico:centro_medico
    });
    await incidencia.save();

    const { data, error } = await resend.emails.send({
      from: "josueperez03@josuepedev.com",
      to: [
        "josuepe03@hotmail.com",
        "josueperezeulogio3@gmail.com",
        "elmichito210119@gmail.com",
      ],
      subject: "REPORTE INCIDENCIA",
      html: `<strong>El dia${fecha_registrada} el equipo ${id_equipo} reporto una incidencia tipo ${tipo_incidencia} de status ${status} en la ubicacion ${ubicacion}</strong>`,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.status(201).json({
      ok: true,
      msg: "¡Incidencia agregada con exito!",
      // incidencia,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

// OBTENER INCIDENCIAS

const obtenerIncidencias = async (req, res = response) => {
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
    let tipo_incidencia = req.query.tipo_incidencia || "All";

    const genreOptions = ["Predictiva", "Correctiva", "Preventiva"];

    tipo_incidencia === "All"
      ? (tipo_incidencia = [...genreOptions])
      : (tipo_incidencia = req.query.tipo_incidencia.split(","));

    const incidencias = await Incidencias.find({
      is_delete: false,
      centro_medico:usuario.centro_medico,
    })
      .populate({
        path: "id_equipo",
        match: { modelo: { $regex: search, $options: "i" } },
        select: { no_serie: 1, marca: 1, modelo: 1 },
      })
      .populate({
        path: "id_operador",
        select: { nombre: 1, apellidos: 1, unidad_medica: 1 },
      })
      .where("tipo_incidencia")
      .in([...tipo_incidencia])
      .skip(page * limit)
      .limit(limit);

    // Filter out incidencias where id_equipo is null or empty
    const filteredIncidencias = incidencias.filter(
      (incidencia) => incidencia.id_equipo
    );

    const total = await Incidencias.countDocuments({
      tipo_incidencia: { $in: [...tipo_incidencia] },
      is_delete: false,
      centro_medico:usuario.centro_medico,
    });

    //VALIDACION EXISTENCIA
    if (!filteredIncidencias || filteredIncidencias.length === 0) {
      return res.json({
        ok: false,
        msg: "Sin incidencias existentes",
      });
    }

    const response = {
      ok: true,
      total: total,
      page: page + 1,
      limit,
      tipo_incidencia: genreOptions,
      incidencias: filteredIncidencias,
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

// Incidencias por equipo
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

//CONCLUIR INCIDENCIA
const terminarIncidencia = async (req, res = response) => {
  const incidenciaId = req.params.id;

  try {
    const incidencia = await Incidencias.findOne({
      _id: incidenciaId,
    });

    if (!incidencia) {
      return res.status(404).json({
        ok: false,
        msg: "La incidencia no existe en el sistema",
      });
    }

    const terminarIncidencia = {
      estado: "Concluido",
    };

    await Incidencias.findByIdAndUpdate(incidenciaId, terminarIncidencia, {
      new: true,
    });

    res.json({
      ok: true,
      msg: "¡Incidencia Concluida Correctamente!",
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
  terminarIncidencia,
};
