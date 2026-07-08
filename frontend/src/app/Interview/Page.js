'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import InterviewChat from '../../components/InterviewChat'
import FeedbackCard from '../../components/FeedbackCard'

export default function InterviewPage() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [allFeedback, setAllFeedback] = useState([])
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const sessionId = localStorage.getItem('session_id')
    if (!sessionId) {
      router.push('/upload')
      return
    }

    fetch(`/api/interview/questions/${sessionId}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load questions')
        return r.json()
      })
      .then(data => {
        setQuestions(data.questions)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  async function submitAnswer() {
    const sessionId = localStorage.getItem('session_id')
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/interview/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          question: questions[currentIndex],
          answer,
        }),
      })
      const data = await res.json()
      setFeedback(data)
      setAllFeedback(prev => [
        ...prev,
        { question: questions[currentIndex], answer, feedback: data },
      ])
    } catch {
      setError('Failed to evaluate answer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function nextQuestion() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(i => i + 1)
      setAnswer('')
      setFeedback(null)
    } else {
      localStorage.setItem('interview_feedback', JSON.stringify(allFeedback))
      router.push('/coding')
    }
  }

  if (loading) return <div className="page-container"><p className="loading-text">Loading your questions...</p></div>
  if (error) return <div className="page-container"><div className="error-box">{error}</div></div>
  if (questions.length === 0) return <div className="page-container"><p className="loading-text">No questions found. Please try uploading again.</p></div>

  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="page-container">
      <h1>Mock Interview</h1>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="question-count">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <InterviewChat question={questions[currentIndex]} />

      {!feedback && (
        <>
          <textarea
            className="answer-input"
            placeholder="Type your answer here..."
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            rows={6}
          />
          {error && <div className="error-box">{error}</div>}
          <button
            className="btn-primary"
            onClick={submitAnswer}
            disabled={submitting || !answer.trim()}
          >
            {submitting ? 'Evaluating...' : 'Submit Answer'}
          </button>
        </>
      )}

      {feedback && (
        <>
          <FeedbackCard feedback={feedback} />
          <button className="btn-primary" onClick={nextQuestion}>
            {currentIndex + 1 < questions.length
              ? 'Next Question →'
              : 'Go to Coding Test →'}
          </button>
        </>
      )}
    </div>
  )
}