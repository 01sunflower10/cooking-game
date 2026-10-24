@echo off
title 食光机 APP
cd /d %~dp0server
echo 正在启动食光机...
echo 启动后请用浏览器打开: http://127.0.0.1:3000
echo 用完直接关闭本窗口即可（数据已实时保存在 MySQL，不怕关）。
echo.
node server.js
pause
