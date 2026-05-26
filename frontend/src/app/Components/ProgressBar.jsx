export default function ProgressBar({ current, total }) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percent}%` }}></div>
      </div>
      <p className="question-count">
        Step {current} of {total} — {percent}% complete
      </p>
    </div>
  )
}