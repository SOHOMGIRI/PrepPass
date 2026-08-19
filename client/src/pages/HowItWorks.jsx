import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/landing/Footer.jsx";

const STEPS = [
  {
    num: "01",
    badge: "REGISTRATION",
    title: "Create Your Placement Passport",
    desc: "Sign up in seconds with verified email security, or explore immediately in demo mode. Your passport securely saves your rehearsal sessions, scores, and custom tracks.",
    icon: "🎫",
  },
  {
    num: "02",
    badge: "ATS RESUME SCAN",
    title: "Upload Your Resume for Instant ATS Auditing",
    desc: "Upload your PDF or DOCX resume to extract text and run a comprehensive ATS compliance audit. Receive a 0–100 score, missing section warnings, and concrete formatting fixes.",
    icon: "📄",
  },
  {
    num: "03",
    badge: "AI CURRICULUM",
    title: "Receive Targeted Subject Recommendations",
    desc: "Based on your resume skills and gap analysis, PrepPass suggests the exact technical and HR topics you need to revise (e.g. DBMS Normalization, React State, System Design).",
    icon: "🎯",
  },
  {
    num: "04",
    badge: "PRACTICE TRACKS",
    title: "Practice Mock Interviews, GDs, & Company Tracks",
    desc: "Choose from 26+ engineering/management roles or 12 top recruiters (TCS, Amazon, Google, Infosys). Answer adaptive technical & HR questions in real-time or draft GD opening statements with AI rebuttals.",
    icon: "🎙️",
  },
  {
    num: "05",
    badge: "RESUME BUILDER",
    title: "Craft & Export ATS-Friendly Resumes",
    desc: "Use our multi-step AI Resume Builder with inline bullet point optimization. Export a clean, recruiter-approved PDF directly from your browser with zero formatting headaches.",
    icon: "✨",
  },
  {
    num: "06",
    badge: "ANALYTICS",
    title: "Review Readiness Analytics in History",
    desc: "Track your average readiness score, per-question clarity/correctness breakdown, past GD sessions, and job match percentages all in one unified passport log.",
    icon: "📊",
  },
];

export default function HowItWorks() {
  const { accessToken } = useAuth();

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between font-body text-ink">
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="font-heading text-lg font-bold text-stamp-navy hover:opacity-80"
          >
            PREPPASS
          </Link>
          <Link
            to={accessToken ? "/dashboard" : "/login"}
            className="font-mono text-xs uppercase tracking-wider text-stamp-navy hover:underline"
          >
            {accessToken ? "Go to Dashboard →" : "Sign In →"}
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="ticket-card mt-8 p-6 sm:p-10">
          <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy">
            PREPPASS GUIDE
          </div>
          <h1 className="mt-4 font-heading text-3xl text-stamp-navy sm:text-4xl">
            How PrepPass Works
          </h1>
          <p className="mt-2 text-sm text-ink/70 leading-relaxed max-w-2xl">
            A complete, step-by-step walkthrough of how PrepPass helps university students and job seekers prepare, practice, and succeed in competitive campus placements.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-10 space-y-6">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className="ticket-card p-6 sm:p-8 transition hover:border-stamp-navy/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-stamp-navy/10 text-2xl">
                    {step.icon}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gold">
                        STEP {step.num}
                      </span>
                      <span className="ticket-stamp rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-stamp-navy">
                        {step.badge}
                      </span>
                    </div>
                    <h2 className="mt-1.5 font-heading text-xl text-stamp-navy">
                      {step.title}
                    </h2>
                    <p className="mt-2 text-sm text-ink/75 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="ticket-card mt-12 p-8 text-center bg-ticket/80">
          <h3 className="font-heading text-2xl text-stamp-navy">
            Ready to test your interview readiness?
          </h3>
          <p className="mt-2 text-xs text-ink/60 max-w-md mx-auto">
            Join hundreds of candidates practicing with adaptive AI questions and ATS-level feedback.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={accessToken ? "/dashboard" : "/register"}
              className="inline-flex items-center justify-center rounded-lg bg-gold px-6 py-3 font-heading font-semibold text-white hover:bg-gold-dark"
            >
              {accessToken ? "Open Your Dashboard" : "Get Started for Free"}
            </Link>
            <Link
              to="/company-prep"
              className="inline-flex items-center justify-center rounded-lg border border-stamp-navy/30 bg-white px-5 py-3 font-mono text-xs text-stamp-navy hover:bg-stamp-navy/5"
            >
              Explore Company Tracks →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
