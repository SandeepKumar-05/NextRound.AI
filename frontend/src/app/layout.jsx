import './globals.css'

export const metadata = {
  title: 'Interview Prep AI',
  description: 'AI-powered mock interview system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar">
          <div className="navbar-brand">Interview Prep AI</div>
          <div className="navbar-links">
            <a href="/">Home</a>
            <a href="/upload">Upload</a>
          </div>
        </nav>
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  )
}