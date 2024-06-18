const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = process.env.SERVER_PORT;

// Crear el servidor de express
const app = express();
const path = require('path');


// Base de datos
dbConnection();

// CORS
app.use(cors())

// Directorio Público
app.use( express.static('public') );

// Lectura y parseo del body
app.use( express.json() );

// Rutas
app.use('/api/auth', require('./routes/auth') );


// Asumiendo que tienes una función de autenticación que devuelve el rol del usuario
function authenticate(req, res, next) {

    const tokenObtenido = req.header("x-token");

    console.log(tokenObtenido)

        next();

}

app.use('/uploads', authenticate, express.static(path.join(__dirname, 'uploads')));

// ADMIN
app.use('/api/operador', require('./routes/operador'));
app.use('/api/tecnico', require('./routes/tecnico'));
app.use('/api/equipo', require('./routes/equipo'));
app.use('/api/ubicaciones', require('./routes/ubicaciones'));
app.use('/api/centro-medico', require('./routes/centroMedico'));

//OPERADOR
app.use('/api/incidencia', require('./routes/incidencia'));

//TECNICO
app.use('/api/visita-incidencia', require('./routes/visitaIncidencia'));

//TECNICO
app.use('/api/super-admin', require('./routes/superAdmin'));

// Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});



