const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = process.env.SERVER_PORT;

// Crear el servidor de express
const app = express();

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

//ADMIN
app.use('/api/admin/operador', require('./routes/operador'));
app.use('/api/admin/tecnico', require('./routes/tecnico'));
app.use('/api/admin/equipo', require('./routes/equipo'));

//OPERADOR
app.use('/api/operador/incidencia', require('./routes/incidencia'));

//TECNICO
app.use('/api/tecnico/visita-incidencia', require('./routes/visitaIncidencia'));




app.listen(SERVER_PORT, SERVER_HOST);





