# PrepPass

PrepPass is a comprehensive placement preparation platform designed to help students practice for technical and HR interviews, group discussions, and aptitude tests. It provides structured feedback, simulated exam environments, and automated resume analysis tools.

## Live Demo
**[https://prep-pass.vercel.app](https://prep-pass.vercel.app)**
*(Guest mode available - no login required to test core features)*

---

## Core Features

### 1. AI Mock Interviews
Users can select their target job role or type a custom one. The platform generates a 4-question interview sequence, alternating between technical and behavioral questions.
- **Dynamic Follow-ups:** After the 1st and 3rd questions, the system reads the user's response and generates a contextual follow-up question to simulate a real interviewer drilling down into details.
- **Speech-to-Text Input:** Users can type their answers or use the microphone for voice-to-text input.
- **Scoring & Feedback:** Every answer is evaluated on Clarity, Correctness, and Completeness (scored 0-10), along with a written feedback paragraph explaining areas for improvement.

### 2. Group Discussion (GD) Practice
Simulates a live group discussion environment.
- **Interactive Rebuttals:** Users speak or type their opening statement on a given topic. The system then acts as another participant, providing a contextual counter-argument or building on the user's points.
- **Real-time Timer:** Enforces strict time limits to mimic standard placement GD rounds.

### 3. Resume Builder & Exporter
A built-in tool to create ATS-friendly resumes from scratch.
- **Live Preview:** Real-time rendering of the resume layout.
- **AI Rewrite Suggestions:** Users can select sections (like project descriptions or experience bullets) and request the AI to rewrite them for better impact and professional tone.
- **Direct PDF Export:** Generates a clean, black-and-white, properly formatted PDF that is optimized for Applicant Tracking Systems (ATS).

### 4. Resume Analyzer (Match to Job Description)
Users can upload an existing resume (PDF or DOCX) to receive an immediate ATS compatibility audit.
- **ATS Score:** Calculates a percentage match based on semantic analysis.
- **Missing Skills & Sections:** Identifies key technologies or resume sections (e.g., "Education", "Projects") that are missing relative to the provided job description.
- **Formatting Issues:** Flags unreadable fonts, missing contact info, or poor layout choices.

### 5. Aptitude Practice & Test Mode
A structured environment for practicing quantitative and logical reasoning questions.
- **Standard Practice:** Users can answer multiple-choice questions and receive instant grading and explanations.
- **Strict Test Mode:** A simulated exam environment that forces full-screen mode and tracks tab-switching or loss of window focus to mimic proctored placement tests.

### 6. Company-Specific Prep Tracks
Provides customized interview tracks tailored to the specific question patterns of major companies (e.g., TCS, Amazon, Google).

### 7. Dashboard & Revision Deck
- **Readiness Trend Graph:** A visual chart tracking the user's performance and scores across past interview sessions and aptitude tests over time.
- **Revision Deck:** Automatically generates digital flashcards based on the user's weakest areas and missed questions from previous sessions, allowing for quick review before actual interviews.

---

## Technical Stack

### Frontend
- **React.js & Vite:** Core UI framework and build tooling.
- **Tailwind CSS:** Utility-first styling, heavily utilizing custom color variables (Gold, Navy) and dark mode styling.
- **Framer Motion:** Component transitions and micro-animations.
- **Recharts:** Used for rendering the Readiness Trend graph on the dashboard.
- **React-to-Print:** Handles the conversion of the DOM-based resume builder into a clean, paginated PDF export.
- **Native Web APIs:** Utilizes the Web Speech API for voice input and the Visibility API for anti-cheat monitoring in Test Mode.
- **Advanced SVG Animation:** The landing page features a complex, mathematically optimized 3D SVG tree with hundreds of animated canopy leaves, embers, and butterflies, operating alongside an HTML5 Canvas snow engine.

### Backend
- **Node.js & Express:** REST API server.
- **MongoDB Atlas & Mongoose:** Database and ODM for storing users, session histories, and cached question banks.
- **Google Gemini API (3.1 Flash Lite):** Handles all natural language processing tasks (question generation, answer grading, GD rebuttals, resume analysis). Uses structured JSON output mode for reliable data parsing.
- **Authentication:** JWT-based system using short-lived access tokens and HttpOnly rotating refresh tokens. Passwords are hashed using bcrypt.
- **File Parsing:** multer for multipart form data, pdf-parse for extracting text from PDFs, and mammoth for DOCX files.
- **Security:** Configured with Helmet.js, CORS whitelisting, and Express Rate Limiting.

---

## System Architecture & Flow

### AI Integration
The platform centralizes all LLM calls through a single utility function (callGeminiJSON). This function enforces structured JSON responses and handles timeout/retry logic. 
To optimize API usage, generated questions for specific job roles are cached in MongoDB. If another user requests an interview for the same role, the system pulls from the database instead of calling the external API.

### Authentication Flow
When a user logs in, the server issues a JWT Access Token (sent to the client memory) and a JWT Refresh Token (stored in a secure HttpOnly cookie). The React AuthContext automatically handles attaching the Access Token to Axios requests via interceptors, and silently requests a new Access Token in the background when the current one expires.

---

## Local Setup Instructions

1. **Clone the repository:**
   `ash
   git clone https://github.com/SOHOMGIRI/PrepPass.git
   cd PrepPass
   `

2. **Backend Setup:**
   `ash
   cd server
   npm install
   `
   Create a .env file in the server directory with the following variables:
   - MONGO_URI
   - JWT_ACCESS_SECRET
   - JWT_REFRESH_SECRET
   - GEMINI_API_KEY
   - CLIENT_URL (e.g., http://localhost:5173)
   - EMAIL_USER & EMAIL_APP_PASSWORD (for OTP verification)
   
   Start the server:
   `ash
   npm run dev
   `

3. **Frontend Setup:**
   Open a new terminal.
   `ash
   cd client
   npm install
   `
   Create a .env.local file in the client directory:
   - VITE_API_URL=http://localhost:5000/api
   
   Start the frontend:
   `ash
   npm run dev
   `

4. **Access the application:**
   Open your browser and navigate to http://localhost:5173.

---

## License

This project is licensed under the MIT License.
