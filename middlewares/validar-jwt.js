const { response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const validarJWT = async (req, res = response, next) => {

  try {
  // x-token headers
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
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
  validarJWT,
};
