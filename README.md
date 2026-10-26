# PræpPass: The Imperial Standard of Candidate Assessment

<p align="center">
  <img src="client/public/favicon.svg" alt="PræpPass Seal" width="96" height="96" />
</p>

<p align="center">
  <strong>An accredited candidate intelligence and simulation engine combining real-time acoustic speech prosody, multi-persona AI interview boards, proctored integrity audits, and semantic ATS resume vector matching.</strong>
</p>

<p align="center">
  <a href="https://praeppass.vercel.app"><strong>Explore Live Platform »</strong></a>
</p>

---

## 🏛️ Executive Summary & Vision

**PræpPass** (derived from the Latin *Praeparatio* and featuring the typographic ligature **`æ`**) was architected to bridge the deep chasm between collegiate academic preparation and enterprise candidate assessment. 

Unlike conventional platforms that serve static question banks behind paywalls, PræpPass functions as an enterprise-grade assessment terminal. It evaluates speech delivery cadence (WPM, dead-air hesitations, and filler words) via client-side Web Audio DSP, challenges engineering candidates with adaptive multi-turn cross-examinations, enforces strict fullscreen proctoring with trust scoring, and calculates resume-to-job-description semantic vector similarity.

---

## ⚡ Core Industrial Capabilities

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PRÆPPASS SYSTEM ARCHITECTURE                                   │
├──────────────────────┬──────────────────────┬────────────────────────────────────────────────────┤
│ Pipeline Stage       │ Technology Engine    │ Functional Delivery                                │
├──────────────────────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 1. Acoustic Prosody  │ Web Audio API +      │ Real-time WPM pacing, decibel energy visualizer,   │
│                      │ SpeechRecognition    │ filler-word frequency ("um", "like") & fluency HUD.│
├──────────────────────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 2. Board Simulation  │ Google Gemini 2.0    │ Multi-persona panels (Architect, VP Eng, HR) with  │
│                      │ Flash (JSON Mode)    │ contextual follow-ups and rubric dimension scores. │
├──────────────────────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 3. Proctored Testing │ Fullscreen + Page    │ 15-MCQ timed exam with focus loss tracking,        │
│                      │ Visibility Engine    │ anti-tamper safeguards, and tiered trust ratings.  │
├──────────────────────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 4. ATS Intelligence  │ Vector Parsing +     │ In-memory PDF/DOCX token extraction with weighted  │
│                      │ Cosine Distance      │ keyword gap analysis and Google X-Y-Z optimization.│
├──────────────────────┼──────────────────────┼────────────────────────────────────────────────────┤
│ 5. Concept Memory    │ Spaced Repetition    │ Interactive flashcards generated automatically from│
│                      │ Flashcard Ledger     │ missed test questions and weak interview concepts. │
└──────────────────────┴──────────────────────┴────────────────────────────────────────────────────┘
```

### 1. Real-Time Acoustic Speech Prosody HUD
- **Live Cadence Engine**: Calculates spoken Words Per Minute (WPM) dynamically, flagging deliberate (< 110 WPM), optimal (110–165 WPM), or rapid (> 165 WPM) pacing.
- **Acoustic Volume Modulation**: Uses `AudioContext` and `AnalyserNode` FFT bins to detect vocal strain or monotone delivery.
- **Filler Word Detection**: Instant flags for disfluencies (*"um"*, *"ah"*, *"like"*, *"basically"*, *"actually"*, *"you know"*).
- **Dead-Air Detection**: Flags unnatural pauses (> 3 seconds) during engineering explanations.

### 2. Multi-Persona Adaptive Interview Boards
- Tailored question sequencing alternating between technical systems architecture and behavioral leadership (STAR method).
- **Contextual In-Flight Follow-Ups**: Evaluates the candidate's actual verbal argument to drill down into architectural trade-offs, concurrency hazards, and edge cases.
- **Dimension Scoring**: Answers evaluated on Clarity, Correctness, Completeness, and Depth (0–10 scale).

### 3. Proctored Fullscreen Test Mode
- 10-minute timed evaluation simulating rigorous online assessment centers.
- **Anti-Cheat Trust Rating**: Monitors window focus, tab-switching, and fullscreen state via the HTML5 Page Visibility API.
- Tiered Trust Score: 0 violations = 100%, 1 violation = 70%, 2 violations = 40%, 3rd violation triggers immediate auto-submit with 0% trust rating.

### 4. ATS Resume Vector Matcher & Architect
- Multi-format parser for `.pdf` and `.docx` candidate resumes.
- Weighted semantic similarity scoring against target job descriptions with keyword gap detection.
- **AI Bullet Enhancer**: Converts unstructured descriptions into Google's standard: *"Accomplished [X], as measured by [Y], by doing [Z]"*.

### 5. Enterprise Company Tracks
- Pre-configured interview tracks modeled after recruitment patterns at top tech organizations (Google, Amazon, Microsoft, TCS, Infosys).

---

## 🛠️ Technology Stack & Engineering Standards

### Frontend
- **Framework**: React 19 + Vite 6
- **Design System**: Tailored **Imperial Editorial Light Luxury** palette (Oxford Midnight Navy `#0A1128`, Warm Alabaster Linen `#FDFBF7`, Gilded Aurum `#C5A059`, and Emerald `#059669`).
- **Telemetry DSP**: Web Audio API (`AudioContext`, `AnalyserNode`) + Web Speech Recognition.
- **Visuals & Charts**: Recharts longitudinal analytics curves + 3D card tilt transformations.
- **Smooth Inertia**: Lenis smooth scrolling engine.

### Backend
- **Runtime**: Node.js (ES Modules) + Express 5
- **Database**: MongoDB Atlas via Mongoose 9 with indexed schemas.
- **AI Engine**: `@google/genai` utilizing `gemini-2.0-flash` with dual-model fallback to `gemini-1.5-flash` and strict JSON schemas.
- **Authentication**: Dual-token architecture (15-minute JWT access tokens + 7-day HttpOnly rotating refresh cookies).
- **Security**: Helmet CSP headers, Express rate-limiting, MongoDB input sanitization, and CORS domain whitelisting.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js**: v20 or higher
- **MongoDB**: Local instance or MongoDB Atlas URI
- **Gemini API Key**: From [Google AI Studio](https://aistudio.google.com/)

### 2. Clone & Install
```bash
git clone https://github.com/SOHOMGIRI/PrepPass.git
cd PrepPass

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Environment Variables

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/praeppass
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.0-flash

# Optional Gmail Credentials (If omitted, runs in console mock OTP mode)
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Boot Services
```bash
# Terminal 1: Backend Server
cd server
npm run dev

# Terminal 2: Frontend Client
cd client
npm run dev
```

---

## 📜 Academic Integrity & License
Engineered and maintained by **SOHOM GIRI**.  
Licensed under the **ISC License**.
