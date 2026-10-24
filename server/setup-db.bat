@echo off
title 食光机 - 初始化数据库（仅首次需要）
echo 即将创建数据库 shiguangji_db 和专用账号，需要输入一次 root 密码。
echo.
set /p MYSQLBIN=请输入 mysql.exe 所在路径（直接回车使用默认）: 
if "%MYSQLBIN%"=="" set "MYSQLBIN=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if not exist "%MYSQLBIN%" (
  echo [错误] 未找到 mysql.exe: %MYSQLBIN%
  echo 请重新运行并输入正确路径，例如 C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
  pause & exit /b 1
)
"%MYSQLBIN%" -u root -p --default-character-set=utf8mb4 < "%~dp0schema.sql"
if errorlevel 1 ( echo [错误] 执行失败，请检查密码后重试 & pause & exit /b 1 )
echo.
echo 数据库初始化完成！账号: shiguangji  库: shiguangji_db
pause
