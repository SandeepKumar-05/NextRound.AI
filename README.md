# AI Mock Interview & Coding Test Platform

> An end-to-end AI-powered platform for personalised technical interview preparation.
> Built with **FastAPI** · **LangChain** · **Pinecone** · **Next.js 14** 

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
    │       ├── layout.js    # Root layout + metadata
    │       ├── page.js       # Landing page (upload, JD, company selector)
    │       └── globals.css    # Design tokens & Tailwind base
    ├── next.config.js
    ├── tsconfig.json
    ├── package.json
    └── .env.local.example
```

---

---

## Roadmap

- [ ] LangChain PDF parser (PyMuPDF / pdfplumber)
- [ ] OpenAI GPT-4 question personalisation chain
- [ ] Pinecone vector indexing of question bank
- [ ] Real-time answer evaluation & scoring
- [ ] WebSocket-based streaming responses
- [ ] Coding sandbox (Monaco Editor integration)
- [ ] User authentication (NextAuth.js + JWT)
