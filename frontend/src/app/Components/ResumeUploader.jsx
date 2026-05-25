'use client'
import { useState } from 'react'

export default function ResumeUploader({ onUpload, loading }) {
  const [resumeFile, setResumeFile] = useState(null)
  const [jdFile, setJdFile] = useState(null)

  function handleSubmit() {
    if (resumeFile && jdFile) {
      onUpload(resumeFile, jdFile)
    }
  }

  return (
    <div className="uploader-form">
      <div className="upload-field">
        <label htmlFor="resume-input">Resume (PDF)</label>
        <input
          id="resume-input"
          type="file"
          accept=".pdf"
          onChange={e => setResumeFile(e.target.files[0] || null)}
        />
        {resumeFile && (
          <span className="file-name">✓ {resumeFile.name}</span>
        )}
      </div>

      <div className="upload-field">
        <label htmlFor="jd-input">Job Description (PDF)</label>
        <input
          id="jd-input"
          type="file"
          accept=".pdf"
          onChange={e => setJdFile(e.target.files[0] || null)}
        />
        {jdFile && (
          <span className="file-name">✓ {jdFile.name}</span>
        )}
      </div>

      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={!resumeFile || !jdFile || loading}
      >
        {loading ? 'Uploading & Analysing...' : 'Upload and Start →'}
      </button>
    </div>
  )
}