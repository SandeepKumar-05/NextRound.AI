"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload,
  FileText,
  Briefcase,
  Building2,
  ChevronDown,
  Sparkles,
  Zap,
  Brain,
  Code2,
  Target,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import clsx from "clsx";

const COMPANIES = [
  { value: "Google", label: "Google", emoji: "🔵" },
  { value: "Meta", label: "Meta", emoji: "🟣" },
  { value: "Amazon", label: "Amazon", emoji: "🟠" },
  { value: "Apple", label: "Apple", emoji: "⚪" },
  { value: "Microsoft", label: "Microsoft", emoji: "🟦" },
  { value: "Netflix", label: "Netflix", emoji: "🔴" },
  { value: "OpenAI", label: "OpenAI", emoji: "🟢" },
];

const DIFFICULTY_STYLE = {
  Easy: "pill pill--easy",
  Medium: "pill pill--medium",
  Hard: "pill pill--hard",
};

const TYPE_STYLE = {
  Technical: "pill pill--blue",
  Behavioral: "pill pill--violet",
  "System Design": "pill pill--cyan",
};

function Navbar() {
  return (
    <header className="navbar glass">
      <div className="navbar__brand">
        <div className="navbar__logo">
          <Brain className="navbar__logo-icon" />
        </div>
        <span className="navbar__title">
          Interview<span className="gradient-text-brand">AI</span>
        </span>
      </div>
      <nav className="navbar__nav">
        <a href="#features">Features</a>
        <a href="#simulator">Simulator</a>
        <a href="#questions">Question Bank</a>
      </nav>
      <a href="#simulator" className="button button--small button--ghost">
        Start Free
      </a>
    </header>
  );
}

function HeroBadge() {
  return (
    <div className="hero-badge glass glass-hover">
      <Sparkles className="hero-badge__icon" />
      <span>Powered by GPT-4 · LangChain · Pinecone</span>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <div className="feature-card glass glass-hover" style={{ animationDelay: `${delay}ms` }}>
      <div className="feature-card__icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function UploadZone({ file, onFile, onClear }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped?.type === "application/pdf") onFile(dropped);
    },
    [onFile]
  );

  const handleChange = (e) => {
    const picked = e.target.files?.[0];
    if (picked) onFile(picked);
  };

  if (file) {
    return (
      <div className="upload-summary glass">
        <div className="upload-summary__icon">
          <FileText />
        </div>
        <div className="upload-summary__details">
          <p>{file.name}</p>
          <p>{(file.size / 1024).toFixed(1)} KB · PDF</p>
        </div>
        <button
          onClick={onClear}
          id="clear-resume-btn"
          className="button button--icon"
          aria-label="Remove file"
        >
          <X />
        </button>
      </div>
    );
  }

  return (
    <div
      id="resume-dropzone"
      role="button"
      tabIndex={0}
      aria-label="Upload resume PDF"
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      className={clsx("upload-zone", dragging ? "upload-zone--dragging" : "upload-zone--idle")}
    >
      <div className="upload-zone__icon">
        <Upload />
      </div>
      <div className="upload-zone__text">
        <p>
          Drop your resume here <span>or click to browse</span>
        </p>
        <p>PDF · Max 10 MB</p>
      </div>
      <input
        ref={inputRef}
        id="resume-file-input"
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        aria-hidden="true"
      />
    </div>
  );
}

function QuestionCard({ q }) {
  return (
    <article className="question-card glass glass-hover">
      <div className="question-card__header">
        <span className={clsx("pill", TYPE_STYLE[q.question_type] || "pill--default")}>{q.question_type}</span>
        <span className={clsx("pill", DIFFICULTY_STYLE[q.difficulty] || "pill--default")}>{q.difficulty}</span>
        <span className="question-card__id">{q.id}</span>
      </div>
      <p className="question-card__text">{q.question_text}</p>
      <p className="question-card__role">{q.role}</p>
    </article>
  );
}

export default function HomePage() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [company, setCompany] = useState("Google");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleStartSimulation = async () => {
    if (!resumeFile) {
      setErrorMsg("Please upload your resume (PDF) before starting.");
      return;
    }

    if (!jobDescription.trim()) {
      setErrorMsg("Please paste the job description.");
      return;
    }

    setErrorMsg("");
    setStatus("loading");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("job_description", jobDescription);
      formData.append("company", company);

      const response = await fetch("http://localhost:8000/api/v1/interview/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setStatus("success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error occurred.";
      setErrorMsg(message);
      setStatus("error");
    }
  };

  return (
    <div className="page-container noise-bg">
      <div className="background-grid grid-bg" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <Navbar />

      <main className="site-main">
        <section className="hero-section">
          <HeroBadge />
          <h1 className="hero-title">
            <span className="gradient-text">Ace every</span>
            <br />
            tech interview
          </h1>
          <p className="hero-copy">
            Upload your resume, paste a job description, and receive personalised mock questions generated by AI — tailored to your target company and role.
          </p>
          <div className="hero-badges-row">
            {COMPANIES.slice(0, 5).map((c) => (
              <span key={c.value} className="hero-pill">
                {c.label}
              </span>
            ))}
          </div>
        </section>

        <section id="features" className="feature-section">
          <FeatureCard
            icon={<Brain />}
            title="AI Resume Analysis"
            description="LangChain parses your resume and semantically matches it against a curated question bank using Pinecone vector search."
            delay={0}
          />
          <FeatureCard
            icon={<Code2 />}
            title="Real Company Questions"
            description="Practice with historically verified Technical, Behavioral, and System Design questions from top-tier companies."
            delay={80}
          />
          <FeatureCard
            icon={<Zap />}
            title="Instant AI Feedback"
            description="GPT-4 evaluates your answers in real time, scoring your response and providing structured improvement suggestions."
            delay={160}
          />
        </section>

        <section id="simulator" className="simulator-section">
          <div className="simulator-card glass">
            <div className="simulator-header">
              <div className="simulator-header__icon">
                <Target />
              </div>
              <div>
                <h2>Start Your Simulation</h2>
                <p>Takes ~10 seconds · No account required</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="resume-dropzone">Resume</label>
                <UploadZone file={resumeFile} onFile={setResumeFile} onClear={() => setResumeFile(null)} />
              </div>

              <div className="form-group">
                <label htmlFor="company-select">Target Company</label>
                <div className="select-wrapper">
                  <select
                    id="company-select"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="select-field"
                  >
                    {COMPANIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.emoji} {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="select-arrow" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="job-description-input">Job Description</label>
                <textarea
                  id="job-description-input"
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here — the more detail, the better the questions..."
                  className="textarea-field"
                />
                <p className="field-note">{jobDescription.length} characters</p>
              </div>

              {errorMsg && (
                <div className="error-message">
                  <AlertCircle />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                id="start-simulation-btn"
                onClick={handleStartSimulation}
                disabled={status === "loading"}
                className={clsx("button button--primary", status === "loading" && "button--disabled")}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="button__icon" />
                    Analyzing with AI…
                  </>
                ) : (
                  <>
                    <Sparkles className="button__icon" />
                    Start Simulation
                  </>
                )}
              </button>
            </div>
          </div>

          {status === "success" && result && (
            <div id="results-section" className="results-panel">
              <div className="summary-bar glass">
                <CheckCircle2 />
                <span>
                  Found <strong>{result.total_questions}</strong> tailored questions for <strong>{result.target_company}</strong>
                </span>
                <span className="summary-bar__filename">{result.resume_filename}</span>
              </div>

              <p className="results-note">{result.message}</p>
              <div className="question-list" id="question-cards">
                {result.questions.map((q) => (
                  <QuestionCard key={q.id} q={q} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} InterviewAI · Built with FastAPI, Next.js, LangChain & Pinecone</p>
      </footer>
    </div>
  );
}
