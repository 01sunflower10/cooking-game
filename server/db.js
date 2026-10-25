// MySQL 连接池
const mysql = require("mysql2/promise");
const path = require("path");
const fs = require("fs");

// 打包为 exe 时配置文件在 server/ 目录（exe 无论在项目根还是 server/ 都能找到）
const isExe = (() => { try { return require("node:sea").isSea(); } catch { return false; } })();
const __exeDir = path.dirname(process.execPath);
const cfgPath = isExe
  ? (fs.existsSync(path.join(__exeDir, "config.json"))
      ? path.join(__exeDir, "config.json")
      : path.join(__exeDir, "server", "config.json"))
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
