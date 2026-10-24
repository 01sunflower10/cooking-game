@echo off
title 食光机 - 备份数据
echo ============================================
echo  食光机数据备份（收藏 / 采购 / 时光轴 / 自定义菜谱）
echo ============================================
echo.

set "MYSQLDUMP=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe"
if not exist "%MYSQLDUMP%" (
  echo [错误] 未找到 mysqldump，请确认 MySQL 安装在默认位置
  pause & exit /b 1
)

rem 生成带日期时间的文件名，如 食光机备份_2026-10-24_2230.sql
set "D=%date:~0,4%-%date:~5,2%-%date:~8,2%"
set "T=%time:~0,2%%time:~3,2%"
set "T=%T: =0%"
set "OUT=%~dp0备份_食光机_%D%_%T%.sql"

echo 正在备份到: %OUT%
"%MYSQLDUMP%" -u shiguangji -p"Sgj#2026cook" shiguangji_db > "%OUT%"
if errorlevel 1 (
  echo [错误] 备份失败，请截图反馈。
  pause & exit /b 1
)

for %%F in ("%OUT%") do echo 备份完成！文件大小: %%~zF 字节
echo.
echo 建议每个月跑一次。恢复方法见 使用说明（README.md）第四节。
pause
