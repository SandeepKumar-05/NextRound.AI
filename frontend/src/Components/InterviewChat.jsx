export default function InterviewChat({ question }) {
  if (!question) return null

  return (
    <div className="chat-bubble">
      <div className="interviewer-avatar">AI</div>
      <div className="chat-text">{question}</div>
    </div>
  )
}