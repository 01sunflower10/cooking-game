// MySQL 连接池
const mysql = require("mysql2/promise");
const path = require("path");
const fs = require("fs");

// 打包为 exe 时配置文件放在 exe 旁边，改密码无需重新打包
const isExe = (() => { try { return require("node:sea").isSea(); } catch { return false; } })();
const cfgPath = isExe
  ? path.join(path.dirname(process.execPath), "config.json")
  : path.join(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(cfgPath, "utf-8"));

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
