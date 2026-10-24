@echo off
title 食光机 APP
cd /d %~dp0server

rem 如果 3000 端口已有服务在跑，就直接开浏览器，不重复启动
netstat -ano | findstr :3000 | findstr LISTENING >nul
if not errorlevel 1 (
  echo 检测到食光机已在运行，直接为你打开页面...
  start http://127.0.0.1:3000
  ping -n 3 127.0.0.1 >nul
  exit /b 0
)

echo 正在启动食光机（需要 MySQL 服务处于运行状态）...
rem 2 秒后自动打开浏览器（等服务就绪）
start "" cmd /c "ping -n 3 127.0.0.1 >nul & start http://127.0.0.1:3000"
node server.js

rem 走到这里说明服务被关闭了
echo.
echo 服务已停止。窗口可以关闭了。
ping -n 4 127.0.0.1 >nul
