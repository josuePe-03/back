const { response } = require("express");
const VisitaIncidencia = require("../models/VisitaIncidencia");

const crearVisitaIncidencia = async (req, res = response) => {
  try {
    let visitaIncidencia = new VisitaIncidencia(req.body);
    await visitaIncidencia.save();

    console.log(visitaIncidencia);

    res.status(201).json({
      ok: true,
      msg: "¡Visita agregada con exito!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const obtenerVisitaIncidencias = async (req, res = response) => {
  try {
    const visitaIncidencias = await VisitaIncidencia.find()
      .populate("id_incidencia", {
        id_equipo: 1,
        tipo_incidencia: 1,
        detalle: 1,
        status: 1,
      })
      .populate("id_tecnico", {
        nombre: 1,
        apellidos: 1,
      });

    res.json({
      ok: true,
      visitaIncidencias,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

//Obtener visitas por incidencia
const obtenerVisitasPorIncidencia = async (req, res = response) => {
  const visita_incidenciaId = req.params.id;

  try {
    const visita_incidencia = await VisitaIncidencia.find({
      id_incidencia: visita_incidenciaId,
    })
      .populate("id_incidencia", {
        id_equipo: 1,
        tipo_incidencia: 1,
        detalle: 1,
        status: 1,
      })
      .populate("id_tecnico", {
        nombre: 1,
        apellidos: 1,
      });

    console.log(visita_incidencia);

    if (!visita_incidenciaId) {
      return res.status(404).json({
        ok: false,
        msg: "La incidencia no existe en el sistema",
      });
    }

    res.json({
      ok: true,
      visita_incidencia,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

//Obtener datos de la visita
const obtenerVisita = async (req, res = response) => {
  const visitaId = req.params.id;

  try {
    const visita = await VisitaIncidencia.findOne({
      _id: visitaId,
    })
      .populate("id_incidencia", {
        id_equipo: 1,
        tipo_incidencia: 1,
        detalle: 1,
        status: 1,
      })
      .populate("id_tecnico", {
        nombre: 1,
        apellidos: 1,
      });

    if (!visita) {
      return res.status(404).json({
        ok: false,
        msg: "La incidencia no existe en el sistema",
      });
    }

    res.json({
      ok: true,
      visita,
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
  crearVisitaIncidencia,
  obtenerVisitaIncidencias,
  obtenerVisitasPorIncidencia,
  obtenerVisita,
};
