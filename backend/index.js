const express = require('express');

require('dotenv').config();

const {PORT} = process.env;

const app = express();

app.use(express.json());



const apiRouter = require('./api/main');

app.use('/api', apiRouter);

app.listen(PORT, function(error){
    if (error){
        console.error(error);
        process.exit(1);
    }
    console.log('Escuchando en el puerto: ',PORT)
})