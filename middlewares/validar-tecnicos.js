const { response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const validarTecnicos = async (req, res = response, next) => {
  try {
    // x-token headers
    const token = req.header("x-token");
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_SEED);

    const usuario = await Usuario.findOne({ _id: uid, is_delete: false });

    if (usuario.rol !== "2" && usuario.rol !== "3") {
      return res.status(401).json({
        ok: false,
        msg: "No tienes acceso",
      });
    }
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }

  next();
};

module.exports = {
  validarTecnicos,
};
