# Council AI

**"Don't Ask One AI. Ask The Council."**

A structured adversarial deliberation platform. Submit your proposal and watch expert AI agents challenge, defend, and judge your ideas.

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
cp .env.example .env        # Add your GEMINI_API_KEY
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

- **Frontend:** Next.js 15 + TypeScript + TailwindCSS + Shadcn UI + Framer Motion
- **Backend:** FastAPI + Gemini API
- **Orchestration:** Client-side parallel streaming

## The Council

| Agent | Role | Mission |
|-------|------|---------|
| **The Advocate** | Visionary Investor | Find the asymmetric upside |
| **The Inquisitor** | Forensic Analyst | Find the fatal flaw |
| **The Arbitrator** | Managing Partner | Deliver the final verdict |

## Built for

Microsoft Agents League Hackathon
