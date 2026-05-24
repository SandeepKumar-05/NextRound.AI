import "./globals.css";

export const metadata = {
  title: "InterviewAI — AI-Powered Mock Interview Platform",
  description:
    "Ace your next tech interview with personalised mock interviews, real company questions, and instant AI feedback powered by GPT-4 and LangChain.",
  keywords: [
    "mock interview",
    "AI",
    "coding test",
    "Google",
    "Meta",
    "Amazon",
    "LeetCode",
    "system design",
  ],
  openGraph: {
    title: "InterviewAI",
    description: "AI-powered mock interviews for top tech companies.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
