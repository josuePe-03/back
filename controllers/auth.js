const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

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

    await usuario.save();

    // Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      rol: usuario.rol,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      error: error.message,
      msg: "Por favor hable con el administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email }).populate({
      path: "centro_medico",
      select: { nombre: 1 },
    });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Credenciales no validas",
      });
    }

    // Confirmar los passwords
    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Credenciales no validas",
      });
    }

    // Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      rol: usuario.rol,
      centroMedico: usuario.centro_medico,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const tokenObtenido = req.header("x-token");

  
  if (!tokenObtenido) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
    });
  }


  const { uid, nombre } = jwt.verify(
    tokenObtenido,
    process.env.SECRET_JWT_SEED
  );

  const usuario = await Usuario.findOne({
    _id: uid,
  }).populate({
    path: "centro_medico",
    select: { nombre: 1 },
  });

  // Generar JWT
  const token = await generarJWT(uid, nombre);

  res.json({
    ok: true,
    rol: usuario.rol,
    uid: uid,
    centroMedico: usuario.centro_medico,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
