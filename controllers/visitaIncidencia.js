const { response } = require("express");
const VisitaIncidencia = require("../models/VisitaIncidencia");
const Incidencias = require("../models/Incidencias");

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

//obtener todas
const obtenerVisitaIncidencias = async (req, res = response) => {
   //fecha hoy
   const today = new Date();
  try {
    const visita = await VisitaIncidencia.find({
      estado: "Pendiente",
      fecha_visita: { $gt: today },
    })
      .populate({
        path: "id_incidencia",
        select: {
          id_equipo: 1,
          tipo_incidencia: 1,
          detalle: 1,
          status: 1,
        },
        populate: {
          path: "id_equipo",
          select: {
            id_equipo: 1,
            marca: 1,
            modelo: 1,
          },
        },
      })
      .populate("id_tecnico", {
        nombre: 1,
        apellidos: 1,
      })
      .sort({ fecha_visita: 1 }); // Sort by fecha_visita in ascending order

    if (!visita) {
      return res.status(404).json({
        ok: false,
        msg: "No hay visitas no existe en el sistema",
      });
    }

    //CONVERTIR ARREGLO
    // Assuming visita_proxima is the result of your query or operation
    const visitaArray = Array.isArray(visita) ? visita : [visita];

    res.json({
      ok: true,
      visitas: visitaArray,
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

//Obtener datos de la visita
const visitaProxima = async (req, res = response) => {
  const operadorId = req.params.id;

  const incidenciaIds = await Incidencias.find(
    { id_operador: operadorId },
    { _id: 1 }
  );

  const incidenciaIdsArray = incidenciaIds.map((doc) => doc._id);

  //fecha hoy
  const today = new Date();

  try {
    const visita_proxima = await VisitaIncidencia.findOne({
      id_incidencia: { $in: incidenciaIdsArray },
      estado: "Pendiente",
      fecha_visita: { $gt: today },
    })
      .populate({
        path: "id_incidencia",
        select: {
          id_equipo: 1,
          tipo_incidencia: 1,
          detalle: 1,
          status: 1,
        },
        populate: {
          path: "id_equipo",
          select: {
            id_equipo: 1,
            marca: 1,
            modelo: 1,
          },
        },
      })
      .populate("id_tecnico", {
        nombre: 1,
        apellidos: 1,
      })
      .sort({ fecha_visita: 1 }); // Sort by fecha_visita in ascending order

    if (!operadorId) {
      return res.status(404).json({
        ok: false,
        msg: "La operador no existe en el sistema",
      });
    }

    //CONVERTIR ARREGLO
    // Assuming visita_proxima is the result of your query or operation
    const visita_proximaArray = Array.isArray(visita_proxima)
      ? visita_proxima
      : [visita_proxima];

    res.json({
      ok: true,
      visita_proxima: visita_proximaArray,
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
  visitaProxima,
};
