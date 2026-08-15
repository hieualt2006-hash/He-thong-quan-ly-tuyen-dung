@echo off
title Launch AI Recruitment ATS Monorepo System
echo ===================================================
echo 🚀 Opening ATS Server & Client Windows...
echo ===================================================
start "" "%~dp0start-server.bat"
start "" "%~dp0start-client.bat"
echo Done! Both Server and Client are launching in separate windows.
