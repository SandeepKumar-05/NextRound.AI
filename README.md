# AI Mock Interview & Coding Test Platform

> An end-to-end AI-powered platform for personalised technical interview preparation.
> Built with **FastAPI** · **LangChain** · **Pinecone** · **Next.js 14** · **Tailwind CSS**.

---

## Project Layout

```
ai-mock-interview-platform/
├── backend/
│   ├── main.py                # FastAPI app — routes & CORS
│   ├── mock_questions.json    # Seed dataset (Google, Meta, Amazon questions)
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
└── frontend/
    ├── src/
    │   └── app/
    │       ├── layout.tsx     # Root layout + metadata
    │       ├── page.tsx       # Landing page (upload, JD, company selector)
    │       └── globals.css    # Design tokens & Tailwind base
    ├── tailwind.config.ts
    ├── next.config.ts
    ├── tsconfig.json
    ├── package.json
    └── .env.local.example
```

---

## Quickstart

### 1 — Backend

```bash
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env           # add your API keys
uvicorn main:app --reload --port 8000
```

API docs → http://localhost:8000/docs

### 2 — Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

UI → http://localhost:3000

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API Server | FastAPI 0.111 + Uvicorn |
| AI/LLM Orchestration | LangChain + LangChain-OpenAI |
| Vector DB | Pinecone |
| Frontend | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS 3 + custom design tokens |
| Icons | Lucide React |

---

## Roadmap

- [ ] LangChain PDF parser (PyMuPDF / pdfplumber)
- [ ] OpenAI GPT-4 question personalisation chain
- [ ] Pinecone vector indexing of question bank
- [ ] Real-time answer evaluation & scoring
- [ ] WebSocket-based streaming responses
- [ ] Coding sandbox (Monaco Editor integration)
- [ ] User authentication (NextAuth.js + JWT)
