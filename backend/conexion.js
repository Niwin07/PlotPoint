const mysql = require('mysql2/promise'); // Cliente MySQL con soporte para Promesas

const {DBNAME, DBUSER, DBPASS, DBHOST} = process.env; // Variables de entorno para la conexión a la base de datos

const db = mysql.createPool({ // Crear un pool de conexiones a la base de datos
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    port: process.env.DBPORT,
    waitForConnections: true, // Esperar si no hay conexiones disponibles
    connectionLimit: 10, // Límite máximo de conexiones en el pool
    queueLimit: 0, // Sin límite en la cola de espera
});

module.exports = db; // Exportar la conexión a la base de datos