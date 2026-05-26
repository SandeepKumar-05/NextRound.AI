export default function Home() {
  return (
    <div className="hero">
      <h1>AI Mock Interview</h1>
      <p>
        Upload your resume and job description to get a fully personalised
        mock interview powered by a local AI — no internet required.
      </p>
      <div className="feature-grid">
        <div className="feature-card">
          <h3>Mock Interview</h3>
          <p>AI-generated questions tailored to your resume and target job role</p>
        </div>
        <div className="feature-card">
          <h3>Live Feedback</h3>
          <p>Get scored and detailed feedback on every single answer</p>
        </div>
        <div className="feature-card">
          <h3>Coding Test</h3>
          <p>Practice real coding problems relevant to your target company</p>
        </div>
        <div className="feature-card">
          <h3>100% Free</h3>
          <p>Runs entirely on your machine using Ollama — no paid APIs</p>
        </div>
      </div>
      <a href="/upload" className="btn-primary">Start Interview →</a>
    </div>
  )
}