const express = require('express'); // Framework web para Node.js
const path = require("path"); // Módulo para manejar rutas de archivos
const cors = require('cors'); // Módulo para habilitar CORS

require('dotenv').config(); // Cargar variables de entorno

const {PORT} = process.env; // Puerto desde el .env 

const apiRouter = require('./api/main'); // Importar el enrutador principal de la API

const app = express(); // Crear la aplicación Express

app.use(cors({ // Habilitar CORS para todas las rutas
    origin: '*',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Middleware para parsear JSON en las solicitudes

app.use("/uploads", express.static(path.join(__dirname, 'uploads'))); // Servir archivos estáticos desde la carpeta 'uploads'

app.use('/api', apiRouter); // Usar el enrutador de la API para todas las rutas que comienzan con /api

app.listen(PORT, function(error){ // Iniciar el servidor en el puerto especificado
    if (error){
        console.error(error);
        process.exit(1);
    }
    console.log('🚀 Servidor escuchando en el puerto: ', PORT);
});
