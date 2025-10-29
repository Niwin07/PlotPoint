const mysql = require('mysql2/promise');

const {DBNAME, DBUSER, DBPASS, DBHOST} = process.env;

const db = mysql.createPool({
    host:DBHOST, 
    user:DBUSER, 
    database:DBNAME, 
    password: DBPASS,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0, 
});

module.exports = db;