@echo off
REM === Set up virtual environment ===
echo [✔] Creating Python virtual environment...
python -m venv venv

echo [✔] Activating virtual environment...
call venv\Scripts\activate

echo [✔] Installing backend dependencies...
pip install --upgrade pip
pip install -r requirements.txt

REM === Install frontend dependencies ===
echo [✔] Installing frontend dependencies...
cd pothole_detection_deployment\civil-infra-frontend
call npm install
cd ..\..

REM === Start FastAPI backend ===
echo [🚀] Launching FastAPI backend at http://localhost:8000
start cmd /k "cd pothole_detection_deployment\civil-infra-backend && venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 8000"

REM === Start React frontend ===
echo [🚀] Launching React frontend at http://localhost:3000
start cmd /k "cd pothole_detection_deployment\civil-infra-frontend && npm start"

echo [🎉] Both backend and frontend started in new terminals.
pause