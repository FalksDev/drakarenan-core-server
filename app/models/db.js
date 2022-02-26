const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

var connection = mysql.createPool({
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    user: dbConfig.USER_NAME,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

module.exports = connection;