'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ResultsPage() {
  const [interviewFeedback, setInterviewFeedback] = useState([])
  const [codingFeedback, setCodingFeedback] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const iv = localStorage.getItem('interview_feedback')
    const cd = localStorage.getItem('coding_feedback')
    if (iv) setInterviewFeedback(JSON.parse(iv))
    if (cd) setCodingFeedback(JSON.parse(cd))
  }, [])

  const interviewAvg = interviewFeedback.length
    ? Math.round(
        interviewFeedback.reduce((s, i) => s + (i.feedback?.score || 0), 0) /
          interviewFeedback.length
      )
    : 0

  const codingScore = codingFeedback?.score || 0

  const overallAvg = codingFeedback
    ? Math.round((interviewAvg + codingScore) / 2)
    : interviewAvg

  function getScoreColor(score) {
    if (score >= 8) return '#16a34a'
    if (score >= 5) return '#d97706'
    return '#dc2626'
  }

  function getScoreLabel(score) {
    if (score >= 8) return 'Excellent'
    if (score >= 6) return 'Good'
    if (score >= 4) return 'Average'
    return 'Needs Improvement'
  }

  function restart() {
    localStorage.clear()
    router.push('/')
  }

  return (
    <div className="page-container">
      <h1>Your Results</h1>
      <p className="subtitle">
        Here is your full performance breakdown across the entire interview.
      </p>

      <div className="score-card">
        <div className="big-score" style={{ color: getScoreColor(overallAvg) }}>
          {overallAvg}<span>/10</span>
        </div>
        <div className="score-label">Overall Score</div>
        <div className="score-verdict" style={{ color: getScoreColor(overallAvg) }}>
          {getScoreLabel(overallAvg)}
        </div>
      </div>

      <div className="score-grid">
        <div className="mini-score-card">
          <div className="mini-score" style={{ color: getScoreColor(interviewAvg) }}>
            {interviewAvg}/10
          </div>
          <div className="mini-label">Interview Average</div>
        </div>
        {codingFeedback && (
          <div className="mini-score-card">
            <div className="mini-score" style={{ color: getScoreColor(codingScore) }}>
              {codingScore}/10
            </div>
            <div className="mini-label">Coding Score</div>
          </div>
        )}
      </div>

      <h2>Interview Feedback</h2>
      {interviewFeedback.length === 0 && (
        <p className="loading-text">No interview feedback found.</p>
      )}
      {interviewFeedback.map((item, i) => (
        <div className="result-item" key={i}>
          <p className="result-question">
            <strong>Q{i + 1}:</strong> {item.question}
          </p>
          <p className="result-answer">
            <em>Your answer:</em> {item.answer}
          </p>
          <div className="result-feedback">
            <span
              className="score-badge"
              style={{
                background: getScoreColor(item.feedback?.score) + '20',
                color: getScoreColor(item.feedback?.score),
              }}
            >
              Score: {item.feedback?.score}/10
            </span>
            {item.feedback?.good && (
              <p><strong>What was good:</strong> {item.feedback.good}</p>
            )}
            {item.feedback?.missing && (
              <p><strong>What was missing:</strong> {item.feedback.missing}</p>
            )}
            {item.feedback?.ideal && (
              <p><strong>Ideal answer:</strong> {item.feedback.ideal}</p>
            )}
          </div>
        </div>
      ))}

      {codingFeedback && (
        <>
          <h2>Coding Feedback</h2>
          <div className="result-item">
            <span
              className="score-badge"
              style={{
                background: getScoreColor(codingFeedback.score) + '20',
                color: getScoreColor(codingFeedback.score),
              }}
            >
              Score: {codingFeedback.score}/10
            </span>
            {codingFeedback.correct && (
              <p style={{ marginTop: '8px' }}>
                <strong>Correct:</strong> {codingFeedback.correct}
              </p>
            )}
            {codingFeedback.feedback && (
              <p style={{ marginTop: '6px' }}>
                <strong>Feedback:</strong> {codingFeedback.feedback}
              </p>
            )}
            {codingFeedback.optimized && (
              <p style={{ marginTop: '6px' }}>
                <strong>Optimized solution:</strong> {codingFeedback.optimized}
              </p>
            )}
          </div>
        </>
      )}

      <button className="btn-primary" onClick={restart}>
        Start New Interview
      </button>
    </div>
  )
}