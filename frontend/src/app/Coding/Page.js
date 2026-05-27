'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import FeedbackCard from '../../components/FeedbackCard'
import ProgressBar from '../../components/ProgressBar'

const CodeEditor = dynamic(() => import('../../components/CodeEditor'), { ssr: false })

const defaultCode = {
  python: '# Write your solution here\ndef solution():\n    pass\n',
  javascript: '// Write your solution here\nfunction solution() {\n  \n}\n',
  java: '// Write your solution here\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n',
}

export default function CodingPage() {
  const [problem, setProblem] = useState('')
  const [code, setCode] = useState(defaultCode.python)
  const [language, setLanguage] = useState('python')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const sessionId = localStorage.getItem('session_id')
    if (!sessionId) {
      router.push('/upload')
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/coding/problem/${sessionId}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load coding problem')
        return r.json()
      })
      .then(data => {
        setProblem(data.problem)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  function handleLanguageChange(e) {
    const lang = e.target.value
    setLanguage(lang)
    setCode(defaultCode[lang])
  }

  async function submitCode() {
    const sessionId = localStorage.getItem('session_id')
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/coding/evaluate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sessionId,
            problem,
            code,
            language,
          }),
        }
      )
      if (!res.ok) throw new Error('Evaluation failed')
      const data = await res.json()
      setFeedback(data)
      localStorage.setItem('coding_feedback', JSON.stringify(data))
    } catch (err) {
      setError(err.message || 'Failed to evaluate code. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <p className="loading-text">Generating your coding problem...</p>
      </div>
    )
  }

  if (error && !problem) {
    return (
      <div className="page-container">
        <div className="error-box">{error}</div>
        <button className="btn-primary" onClick={() => router.push('/upload')}>
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="page-container wide">
      <ProgressBar current={2} total={2} label="Coding Test" />

      <h1>Coding Test</h1>
      <p className="subtitle">
        Read the problem carefully and write your solution in the editor below.
      </p>

      <h2>Problem Statement</h2>
      <div className="problem-box">{problem}</div>

      <div className="editor-header">
        <label htmlFor="lang-select">
          <strong>Language:</strong>
        </label>
        <select id="lang-select" value={language} onChange={handleLanguageChange}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="java">Java</option>
        </select>
      </div>

      <CodeEditor
        language={language}
        value={code}
        onChange={val => setCode(val || '')}
      />

      {error && <div className="error-box" style={{ marginTop: '0.75rem' }}>{error}</div>}

      {!feedback && (
        <button
          className="btn-primary"
          onClick={submitCode}
          disabled={submitting || !code.trim()}
        >
          {submitting ? 'Evaluating your code...' : 'Submit Code'}
        </button>
      )}

      {feedback && (
        <>
          <FeedbackCard feedback={feedback} coding={true} />
          <button
            className="btn-primary"
            onClick={() => router.push('/results')}
          >
            See Final Results →
          </button>
        </>
      )}
    </div>
  )
}