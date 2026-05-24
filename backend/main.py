"""
AI Mock Interview & Coding Test Platform — FastAPI Backend
"""

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import os
import uvicorn
from typing import Optional

# ---------------------------------------------------------------------------
# App initialisation
# ---------------------------------------------------------------------------
app = FastAPI(
    title="AI Mock Interview Platform API",
    description="Backend service for AI-powered mock interview analysis, question generation, and coding test evaluation.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------------
# CORS — allow the Next.js dev server
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Helper — load mock question dataset
# ---------------------------------------------------------------------------
QUESTIONS_PATH = os.path.join(os.path.dirname(__file__), "mock_questions.json")

def load_mock_questions() -> list[dict]:
    with open(QUESTIONS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"])
async def root():
    return {"status": "ok", "message": "AI Mock Interview Platform API is running."}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy", "version": "1.0.0"}


# ---------------------------------------------------------------------------
# POST /api/v1/interview/analyze
# ---------------------------------------------------------------------------
@app.post("/api/v1/interview/analyze", tags=["Interview"])
async def analyze_interview(
    resume: UploadFile = File(..., description="Candidate resume in PDF format"),
    job_description: str = Form(..., description="Full text of the job description"),
    company: Optional[str] = Form("Google", description="Target company name"),
    role: Optional[str] = Form("Software Engineer", description="Target role / position"),
):
    """
    Accept a resume PDF and a job description, then return a curated set of
    interview questions tailored to the candidate's profile.

    In production this endpoint will:
      1. Parse the resume with LangChain document loaders.
      2. Embed both resume and JD text, store in Pinecone.
      3. Perform semantic search against the question bank.
      4. Use an OpenAI LLM chain to generate personalised follow-ups.

    For now it returns a filtered slice of the mock dataset.
    """
    # --- Basic validation ---------------------------------------------------
    if resume.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type '{resume.content_type}'. Please upload a PDF.",
        )

    file_bytes = await resume.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded resume file is empty.")

    # --- Load questions & filter by company --------------------------------
    all_questions = load_mock_questions()
    filtered = [
        q for q in all_questions
        if q.get("company", "").lower() == company.lower()
    ]
    if not filtered:
        filtered = all_questions  # fallback — return everything

    # --- Build response payload --------------------------------------------
    return JSONResponse(
        content={
            "status": "success",
            "resume_filename": resume.filename,
            "resume_size_bytes": len(file_bytes),
            "target_company": company,
            "target_role": role,
            "job_description_preview": job_description[:200] + "…" if len(job_description) > 200 else job_description,
            "questions": filtered,
            "total_questions": len(filtered),
            "message": (
                "Mock questions returned. In production, responses will be "
                "personalised using LangChain + OpenAI based on your resume."
            ),
        }
    )


# ---------------------------------------------------------------------------
# GET /api/v1/questions  — browse the full question bank
# ---------------------------------------------------------------------------
@app.get("/api/v1/questions", tags=["Questions"])
async def get_questions(
    company: Optional[str] = None,
    question_type: Optional[str] = None,
    difficulty: Optional[str] = None,
):
    """Return questions from the mock dataset with optional filters."""
    questions = load_mock_questions()

    if company:
        questions = [q for q in questions if q["company"].lower() == company.lower()]
    if question_type:
        questions = [q for q in questions if q["question_type"].lower() == question_type.lower()]
    if difficulty:
        questions = [q for q in questions if q["difficulty"].lower() == difficulty.lower()]

    return {"total": len(questions), "questions": questions}


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
