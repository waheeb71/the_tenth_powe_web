@echo off
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing dependencies...
pip install -r requirements.txt
echo Starting FastAPI Server...
uvicorn main:app --reload --host 0.0.0.0 --port 8000
