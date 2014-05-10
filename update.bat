@ECHO OFF
rmdir node_modules /s /q
call npm install
call npm install supervisor -g
