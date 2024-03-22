const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config');

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
app.use('/api/events', require('./routes/events') );

//ADMIN
app.use('/api/admin/operador', require('./routes/operador'));
app.use('/api/admin/tecnico', require('./routes/tecnico'));
app.use('/api/admin/equipo', require('./routes/equipo'));

//OPERADOR
app.use('/api/operador/incidencia', require('./routes/incidencia'));

//TECNICO
app.use('/api/tecnico/visita-incidencia', require('./routes/visitaIncidencia'));





// Escuchar peticiones
app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});






