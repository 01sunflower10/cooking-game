// MySQL 连接池
const mysql = require("mysql2/promise");
const config = require("./config.json");

const pool = mysql.createPool({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 5,
});

module.exports = pool;
