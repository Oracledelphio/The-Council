<div align="center">
  <img src="./frontend/public/window.svg" alt="Council AI Logo" width="120" />
  <h1>The Council AI</h1>
  <p><strong>"Don't Ask One AI. Ask The Council."</strong></p>

  <p>
    <a href="#about">About</a> •
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#quick-start">Quick Start</a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" />
    <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" />
    <img alt="Gemini API" src="https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" />
    <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  </p>
</div>

<br />

## 🏛️ About The Council

**The Council AI** transforms the traditional "chatbot" paradigm into a high-stakes, adversarial decision intelligence platform. Instead of receiving a single, polite answer from a language model, users submit proposals to a simulated board of domain experts. 

These specialized AI agents rigorously debate the merits of your proposal in real-time. An impartial Arbitrator then parses the core evidence, evaluates the debate, and delivers a final, mathematically sound ruling. 

Designed for the **Microsoft Agents League Hackathon**, The Council AI delivers an enterprise-grade boardroom experience, stripping away conversational pleasantries to focus purely on stress-testing ideas.

<br />

## ✨ Features

- **🎭 Dynamic Council Presets**: Instantly reconfigure the board's expertise before submitting a proposal.
  - **Investor Panel:** Venture Capitalist vs. Short Seller (Verdict: FUND/KILL)
  - **Product Review Board:** Product Strategist vs. QA Director (Verdict: APPROVE/REJECT)
  - **Executive Council:** Growth Exec vs. Risk Exec (Verdict: PROCEED/HALT)
- **⚡ Live Streaming Deliberation**: Watch the Advocate and Inquisitor debate your proposal in real-time with synchronized UI state management.
- **🔍 Reasoning Visibility**: The backend automatically extracts "Core Claims" from your proposal and maps them to a structured Evidence Board, showing exactly which claims were supported or successfully attacked.
- **📊 Zero-Dependency PDF Export**: Generate a stunning, McKinsey-style executive white paper of the final verdict using advanced CSS `@media print` utilities directly from the dashboard.
- **🛡️ Enterprise Reliability**: Custom exponential backoff, graceful API degradation, and transient error catching ensure the platform survives network blips and API rate limits.

<br />

## ⚙️ Architecture

The system is fully decoupled into a **Next.js frontend** and a **FastAPI backend**.

1. **Frontend (Next.js + Tailwind + Framer Motion)**
   - Manages the complex state machine (Idle -> Extracting -> Deliberating -> Judging -> Complete).
   - Handles parallel asynchronous streaming of agent responses.
   - Beautiful, dark-mode boardroom aesthetic with glassmorphism and subtle animations.

2. **Backend (Python + FastAPI + Google Gemini 2.5 Flash)**
   - Factory pattern for dynamic system prompt generation based on active Council presets.
   - Pipelined AI reasoning:
     1. *Claim Extraction* (Structured JSON)
     2. *Advocate Case* (Streaming Text)
     3. *Inquisitor Challenge* (Streaming Text)
     4. *Arbitrator Ruling* (Structured JSON)

<br />

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- A Google Gemini API Key

### 1. Start the Backend

```bash
cd backend
python -m venv venv

# Activate the virtual environment
venv\Scripts\activate       # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env        
# Edit .env and add your GEMINI_API_KEY

# Run the server
uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Ensure NEXT_PUBLIC_API_URL=http://localhost:8000

# Run the development server
npm run dev
```

### 3. Deliberate
Open [http://localhost:3000](http://localhost:3000) in your browser. Select your Council, submit a proposal, and face the judgment.

<br />

---

<div align="center">
  <i>"When rigid systems fail, human judgment must prevail."</i>
</div>
