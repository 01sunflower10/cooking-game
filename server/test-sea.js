const path = require("path");
const fs = require("fs");
const exeDir = path.dirname(process.execPath);
const isExe = (() => { try { return require("node:sea").isSea(); } catch (e) { return "ERR:" + e.message; } })();
const srv = path.join(exeDir, "server");
const pkg = path.join(srv, "package.json");
console.log(JSON.stringify({
  isExe, exeDir,
  srvPkgExists: fs.existsSync(pkg),
  expressExists: fs.existsSync(path.join(srv, "node_modules", "express", "package.json"))
}));
try {
  const { createRequire } = require("node:module");
  const req = createRequire(pkg);
  const e = req("express");
  console.log("createRequire(express) OK:", typeof e);
} catch (e) {
  console.log("createRequire FAIL:", e.message.split("\n")[0]);
}
