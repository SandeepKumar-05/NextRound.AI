export default function FeedbackCard({ feedback, coding = false }) {
  if (!feedback) return null

  return (
    <div className="feedback-card">
      <div className="feedback-score">
        Score: <strong>{feedback.score} / 10</strong>
      </div>

      {coding ? (
        <>
          {feedback.correct && (
            <p><span className="label">Correct: </span>{feedback.correct}</p>
          )}
          {feedback.feedback && (
            <p><span className="label">Feedback: </span>{feedback.feedback}</p>
          )}
          {feedback.optimized && (
            <p><span className="label">Optimized Solution: </span>{feedback.optimized}</p>
          )}
        </>
      ) : (
        <>
          {feedback.good && (
            <p><span className="label">What was good: </span>{feedback.good}</p>
          )}
          {feedback.missing && (
            <p><span className="label">What was missing: </span>{feedback.missing}</p>
          )}
          {feedback.ideal && (
            <p><span className="label">Ideal answer: </span>{feedback.ideal}</p>
          )}
        </>
      )}
    </div>
  )
}