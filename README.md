# PrepPass — AI-Powered Placement Preparation Platform

> **Your Placement, Rehearsed.**  
> Mock interviews • AI readiness scoring • Resume-to-JD matching — wrapped in an exam admit card you can rehearse, refine, and walk in with.

---

## 🌐 Live Demo

🔗 **[https://prep-pass.vercel.app](https://prep-pass.vercel.app)**

> **No login required** — all core features work without creating an account.

---

## 🎯 The Problem

Placement season in India — millions of students sit for technical and HR interviews with no structured, adaptive feedback on their preparation. Static question banks don't reflect your target role, you never know if your answer was actually good, and resumes often have blind spots for specific JDs.

**PrepPass fixes this.** It gives you a personalised, AI-driven interview rehearsal that scores your answers, adapts follow-up questions based on *what you said*, and matches your resume against any job description to find skill gaps.

---

## ✨ Features

### 🎤 AI Mock Interview
- Pick any job role (or type your own)
- 4-question interview alternating between Technical and HR
- Each answer is scored on **Clarity, Correctness, Completeness** (0–10 each)
- After questions 1 & 3, a **live follow-up** is generated based on your actual answer
- Overall **Readiness Score** (0–10) at the end

### 📄 Resume Matcher
- Upload PDF or DOCX — text extracted server-side via `pdf-parse` and `mammoth`
- Paste any job description
- Returns: **Match Score (0–100%)**, Matched Skills, Missing Skills, and 3–5 Actionable Recommendations
- All results saved in history

### 📊 Dashboard & History
- Average readiness score across all completed sessions
- Full session history with per-question scores and feedback

### 🔐 Authentication
- Register & login with JWT (access + rotating refresh tokens in HttpOnly cookies)
- Passwords hashed with bcrypt (12 rounds)
- Guest mode available — no login needed to try features

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 8 | Build tool & dev server |
| React Router 7 | Client-side SPA routing |
| Framer Motion | Page transitions, micro-animations |
| Three.js + @react-three/fiber | 3D hero section background |
| Axios | HTTP client with JWT interceptors |
| TailwindCSS 3 | Utility-first styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 24 (ES Modules) | Runtime |
| Express 5 | HTTP server |
| Mongoose 9 | MongoDB ODM |
| @google/genai | Gemini API SDK for AI features |
| jsonwebtoken | JWT auth (access + refresh) |
| bcryptjs | Password hashing |
| multer | Multipart file uploads (resume) |
| pdf-parse | PDF text extraction |
| mammoth | DOCX text extraction |
| helmet | Security headers |
| cors | Cross-origin config |
| express-rate-limit | Rate limiting |
| express-validator | Input validation |

### Infrastructure
| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Render | Backend hosting |
| Vercel | Frontend hosting |
| Google AI Studio | Gemini API key |

---

## 🤖 How Generative AI is Used

PrepPass uses Google's **Gemini 3.1 Flash Lite** model through the official `@google/genai` SDK. All AI calls go through a single reusable utility (`callGeminiJSON`) that handles JSON response mode, automatic retries, and timeouts.

### 1. Question Generation
When a user picks a role that doesn't have enough cached questions, Gemini generates role-specific interview questions (technical + HR). Generated questions are saved to MongoDB so the API isn't called again for the same role.

### 2. Answer Scoring
After every answer, Gemini evaluates it across 4 dimensions — Clarity, Correctness, Completeness, and an Overall score. It also returns a written feedback paragraph explaining what was strong and what could improve.

### 3. Follow-Up Generation
After the 1st and 3rd answers, Gemini reads the user's actual response and generates a contextual follow-up — drilling deeper into concepts the user mentioned. This makes every session unique.

### 4. Resume Matching
The resume text is extracted server-side and sent to Gemini along with the job description. Gemini performs semantic skill analysis — not simple keyword matching — and returns a match score, lists of matched and missing skills, and concrete improvement recommendations.

---

## 🏗 Architecture

```
Browser (React SPA)
    │
    ├── Landing / Register / Login / Dashboard
    ├── Interview Page ──► POST /api/interview/start, /answer, /finish
    ├── Resume Matcher ──► POST /api/resume/match (multipart)
    └── History ──► GET /api/interview/history, /api/resume/history
         │
         │  HTTPS (Axios + JWT interceptor)
         ▼
Express Server (Node.js)
    │
    ├── Auth routes (register, login, refresh, logout)
    ├── Interview routes ──► callGeminiJSON() ──► Gemini API
    ├── Resume routes ──► pdf-parse / mammoth ──► callGeminiJSON() ──► Gemini API
    └── Middleware: helmet, cors, rate-limit, sanitize, JWT verify
         │
         ▼
MongoDB Atlas (Users, Questions, InterviewSessions, ResumeMatches)
```

---

## 📁 Project Structure

```
preppass/
├── client/                     # React SPA (Vite)
│   ├── src/
│   │   ├── api/                # Axios client, JWT token store
│   │   ├── components/         # Reusable UI (InterviewCard, GaugeCircle, Hero3D, etc.)
│   │   ├── context/            # AuthContext (global auth state)
│   │   └── pages/              # Landing, Dashboard, Interview, ResumeMatcher, History
│   └── vercel.json             # SPA rewrite rule
│
├── server/                     # Express API
│   ├── src/
│   │   ├── config/db.js        # MongoDB connection
│   │   ├── controllers/        # authController, interviewController, resumeController
│   │   ├── middleware/          # auth, errorHandler, rateLimiter, sanitize, validate
│   │   ├── models/             # User, Question, InterviewSession, ResumeMatch
│   │   ├── routes/             # authRoutes, interviewRoutes, resumeRoutes
│   │   ├── utils/gemini.js     # callGeminiJSON — core AI utility
│   │   └── index.js            # Server entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Local Setup

```bash
# Clone
git clone https://github.com/SOHOMGIRI/PrepPass.git && cd PrepPass

# Server
cd server && npm install
# Create server/.env with: MONGO_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, GEMINI_API_KEY, CLIENT_URL, EMAIL_USER, EMAIL_APP_PASSWORD
npm run dev

# Client (new terminal)
cd client && npm install
# Create client/.env.local with: VITE_API_URL=http://localhost:5000/api
npm run dev
```

Visit **http://localhost:5173**

---

## 🔐 Security

- JWT access tokens (15 min) + rotating refresh tokens (7 day, HttpOnly cookie)
- bcrypt password hashing (12 rounds)
- Helmet.js security headers (CSP, HSTS, X-Frame-Options)
- CORS whitelist from environment variable
- Per-endpoint rate limiting (3 registrations/hr, 5 logins/15min)
- express-validator input validation
- Custom input sanitization middleware
- Resume text treated as untrusted in AI calls
- Multer validates file type — only PDF/DOCX accepted, in-memory only

---

## 👨‍💻 Author

**Sohom Giri** — [@SOHOMGIRI](https://github.com/SOHOMGIRI)

## 📄 License

MIT
