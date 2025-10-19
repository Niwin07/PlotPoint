const express = require('express');
const path = require("path");

require('dotenv').config();

const {PORT} = process.env;

const apiRouter = require('./api/main');

const app = express();

app.use(express.json());

// Directorio público para archivos (fotos de perfil)
// Los archivos serán accesibles en: http://localhost:PORT/uploads/nombre-archivo.jpg
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.use('/api', apiRouter);

app.listen(PORT, function(error){
    if (error){
        console.error(error);
        process.exit(1);
    }
    console.log('Escuchando en el puerto: ', PORT);
});