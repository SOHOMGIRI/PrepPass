import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import SpotlightCard from "../components/landing/SpotlightCard.jsx";
import Footer from "../components/landing/Footer.jsx";

const STEPS = [
  {
    num: "01",
    badge: "ATS SCAN & SUGGESTIONS",
    title: "Upload Your Resume for an ATS Score & Suggested Prep Subjects",
    desc: "Upload your resume in PDF or DOCX format for an instant 0–100 ATS compliance audit, section completeness check, and automated curriculum recommendations for technical and HR topics to revise.",
    icon: "📄",
  },
  {
    num: "02",
    badge: "RESUME BUILDER",
    title: "Build or Refine Your Resume with AI-Assisted Bullet Points",
    desc: "Craft a recruiter-approved, ATS-friendly resume using our guided multi-step builder with inline AI bullet point enhancement and instant PDF export.",
    icon: "✨",
  },
  {
    num: "03",
    badge: "ACTIVE PRACTICE",
    title: "Practice via Aptitude Drills, Proctored Tests, Mock Interviews & GDs",
    desc: "Rehearse with untimed Aptitude practice (Quants, Logic, Verbal), 10-minute proctored MCQ assessments with trust scoring, adaptive mock interviews (with optional voice & camera mode), AI group discussions, and company-specific tracks (TCS, Amazon, Google).",
    icon: "🎙️",
  },
  {
    num: "04",
    badge: "REVISION DECK",
    title: "Review Your Weak Areas in the Revision Deck",
    desc: "Automatically transform your incorrect test answers and low-scoring interview responses into an interactive 3D flashcard deck with explanations, flip animations, and mastery tracking.",
    icon: "🃏",
  },
  {
    num: "05",
    badge: "PERFORMANCE ANALYTICS",
    title: "Track Growth via Readiness Trends & Compare via Peer Percentiles",
    desc: "Visualize your multi-session accuracy trajectory across interviews, tests, and GDs with normalized trend charts, and benchmark your subject performance against fellow candidates with anonymized peer percentiles.",
    icon: "📊",
  },
  {
    num: "06",
    badge: "DETAILED REPORTS",
    title: "Optionally Unlock Detailed Diagnostic Reports via UPI",
    desc: "Unlock comprehensive question-by-question answer keys, correct explanations, and subject-wise accuracy breakdowns for any completed test session for ₹49 via simple UPI QR payment.",
    icon: "⚡",
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
          
          <div className="mt-10 space-y-6">
            {STEPS.map((step) => (
              <SpotlightCard
                key={step.num}
                className="p-6 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-gold/20 font-mono text-sm font-bold text-stamp-navy">
                      {step.num}
                    </div>
                    <div>
                      <div className="ticket-stamp inline-block rounded px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-stamp-navy mb-2 border border-stamp-navy/10">
                        {step.badge}
                      </div>
                      <h2 className="font-heading text-lg sm:text-xl text-stamp-navy mb-1.5">
                        {step.title}
                      </h2>
                      <p className="text-sm text-ink/70 leading-relaxed max-w-2xl">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  <div className="text-3xl hidden sm:block opacity-60">
                    {step.icon}
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="ticket-card mt-12 p-8 text-center bg-ticket/80">
          <h3 className="font-heading text-2xl text-stamp-navy">
            Ready to test your interview readiness?
          </h3>
          <p className="mt-2 text-xs text-ink/60 max-w-md mx-auto">
            Join candidates practicing with adaptive AI questions, proctored tests, and ATS-level feedback.
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





