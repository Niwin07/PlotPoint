const express = require('express');
const path = require("path");
const cors = require('cors');

require('dotenv').config();

const {PORT} = process.env;

const apiRouter = require('./api/main');

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

app.use('/api', apiRouter);

app.listen(PORT, function(error){
    if (error){
        console.error(error);
        process.exit(1);
    }
    console.log('🚀 Servidor escuchando en el puerto: ', PORT);
});
