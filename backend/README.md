# AI Mock Interview Platform — Backend

## Setup

```bash
# 1. Create & activate a virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Copy environment variables
cp .env.example .env          # fill in your keys

# 4. Run the development server
uvicorn main:app --reload --port 8000
```

API docs will be available at:
- Swagger UI → http://localhost:8000/docs
- ReDoc      → http://localhost:8000/redoc

## Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/v1/interview/analyze` | Analyze resume + JD, return questions |
| GET | `/api/v1/questions` | Browse mock question bank |
