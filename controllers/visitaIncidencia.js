const { response } = require("express");
const VisitaIncidencia = require("../models/VisitaIncidencia");
const Incidencias = require("../models/Incidencias");
const RefaccionesVisita = require("../models/RefaccionesVisita");

const crearVisitaIncidencia = async (req, res = response) => {
  const { id_incidencia } = req.body;

  try {
    //AGREGA VISITA
    let visitaIncidencia = new VisitaIncidencia(req.body);
    await visitaIncidencia.save();

    //CAMBIAR ESTADO
    const operador = await Incidencias.findOne({
      id_incidencia: id_incidencia,
    });

    if (!id_incidencia) {
      return res.status(404).json({
        ok: false,
        msg: "Incidencia no existe por ese id",
      });
    }

    const nuevaIncidencia = {
      estado: "Diagnosticado",
    };

    await Incidencias.findByIdAndUpdate(id_incidencia, nuevaIncidencia, {
      new: true,
    });

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
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 4;
    const search = req.query.search || "";

    const visita = await VisitaIncidencia.find({
      estado: "Visita Pendiente",

    })
      .populate({
        path: "id_incidencia",

        select: {
          id_equipo: 1,
          tipo_incidencia: 1,
          detalle: 1,
          status: 1,
        },
        populate: [
          {
            path: "id_equipo",
            select: {
              marca: 1,
              modelo: 1,
              no_serie: 1,
            },
          },
          {
            path: "id_operador",
            select: {
              _id: 1,
              unidad_medica: 1,
            },
          },
        ],
      })
      .populate("id_tecnico", {
        nombre: 1,
        apellidos: 1,
      })
      .skip(page * limit)
      .limit(limit)
      .sort({ fecha_visita: 1 }); // Sort by fecha_visita in ascending order


    const total = await VisitaIncidencia.countDocuments({
      estado: "Visita Pendiente",
    });

    //VALIDACION EXISTENCIA
    if (!visita || visita.length === 0) {
      return res.json({
        ok: false,
        msg: "Sin visitas existentes",
      });
    }
    const response = {
      ok: true,
      total,
      page: page + 1,
      limit,
      visita,
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


    if (!visita_incidencia || visita_incidencia.length === 0) {
      return res.json({
        ok: false,
        msg: "Sin visitas",
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
      estado: "Visita Pendiente",
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

    if (visita_proxima == null) {
      return res.json({
        ok: false,
        msg: "Sin Visitas",
        visita_proxima: [],
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

//TERMINAR visita

const terminarVisita = async (req, res = response) => {
  const visitaId = req.params.id;

  const { estado, id_incidencia } = req.body;

  try {
    const visita = await VisitaIncidencia.findOne({
      _id: visitaId,
    });

    if (!visita) {
      return res.status(404).json({
        ok: false,
        msg: "La visita no existe en el sistema",
      });
    }

    //CAMBIA VISITA A CONCLUIDA
    if (estado == "Visita Concluida") {
      const terminarVisita = {
        ...req.body,
      };

      const revisionIncidencia = {
        estado: "Revision Operador",
      };

      await VisitaIncidencia.findByIdAndUpdate(visitaId, terminarVisita, {
        new: true,
      });
      await Incidencias.findByIdAndUpdate(id_incidencia, revisionIncidencia, {
        new: true,
      });
    } else if (estado == "Tecnico Asignado") {
      const { id_incidencia, id_tecnicoAsignado, fecha_visita } = req.body;

      const terminarVisita = {
        ...req.body,
      };

      await VisitaIncidencia.findByIdAndUpdate(visitaId, terminarVisita, {
        new: true,
      });

      //AGREGA VISITA
      let visitaIncidenciaNew = new VisitaIncidencia({
        id_incidencia: id_incidencia,
        id_tecnico: id_tecnicoAsignado,
        id_tecnicoAsignado: "",
        fecha_revisado: new Date(),
        fecha_visita: fecha_visita,
        observacion: "",
        estado: "Visita Pendiente",
        title:
          "Visita " +
          id_incidencia.id_operador.unidad_medica +
          " Equipo " +
          id_incidencia.id_equipo.no_serie,
      });

      await visitaIncidenciaNew.save();
    } else {
      const {
        id_incidencia,
        id_tecnico,
        fecha_visita,
        lista_refacciones,
        observacion,
      } = req.body;

      const terminarVisita = {
        ...req.body,
      };

      await VisitaIncidencia.findByIdAndUpdate(visitaId, terminarVisita, {
        new: true,
      });

      //AGREGA VISITA
      let visitaIncidenciaNew = new VisitaIncidencia({
        id_incidencia: id_incidencia,
        id_tecnico: id_tecnico,
        fecha_revisado: new Date(),
        fecha_visita: fecha_visita,
        observacion: "",
        estado: "Visita Pendiente",
        title:
          "Visita " +
          id_incidencia.id_operador.unidad_medica +
          " Equipo " +
          id_incidencia.id_equipo.no_serie,
      });

      await visitaIncidenciaNew.save();

      let refacciones = new RefaccionesVisita({
        id_visita: visitaIncidenciaNew._id,
        refacciones: lista_refacciones,
      });

      await refacciones.save();
    }

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

module.exports = {
  crearVisitaIncidencia,
  obtenerVisitaIncidencias,
  obtenerVisitasPorIncidencia,
  obtenerVisita,
  visitaProxima,
  //TERMINAR VISITA
  terminarVisita,
};
