import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/landing/Footer.jsx";

export default function About() {
  const { accessToken } = useAuth();

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between font-body text-text-secondary">
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="font-heading text-lg font-bold text-text-primary hover:opacity-80"
          >
            PREPPASS
          </Link>
          <Link
            to={accessToken ? "/dashboard" : "/login"}
            className="font-mono text-xs uppercase tracking-wider text-text-primary hover:underline"
          >
            {accessToken ? "Dashboard →" : "Sign In →"}
          </Link>
        </div>

        {/* Main Content Ticket */}
        <div className="ticket-card mt-8 p-6 sm:p-10 space-y-6">
          <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-primary">
            OUR MISSION & STORY
          </div>

          <h1 className="font-heading text-3xl text-text-primary sm:text-4xl">
            About PrepPass
          </h1>

          <div className="ticket-perf my-6" />

          <div className="space-y-5 text-sm text-text-secondary/80 leading-relaxed">
            <p>
              We built PrepPass because we experienced firsthand how overwhelming and opaque campus recruitment can be. Every year, millions of engineering and management students spend hundreds of hours solving generic questions, yet walk into placement interviews unprepared for live technical follow-ups, strict ATS screening filters, and unstructured group discussions.
            </p>

            <p>
              Traditional interview prep platforms either charge exorbitant subscription fees or provide static question lists that fail to simulate the actual back-and-forth dynamics of an interview. We designed PrepPass to act as an intelligent, accessible practice partner—one that analyzes your real resume, identifies subject blind spots, challenges your reasoning with adaptive questions, and scores your clarity, correctness, and structure in real time.
            </p>

            <p>
              Our mission is to level the playing field for every job seeker. Whether you are aiming for IT service giants like TCS and Infosys or top product companies like Amazon and Google, PrepPass provides realistic, privacy-conscious tools to help you practice with confidence, refine your resume, and earn your placement pass.
            </p>
          </div>

          <div className="ticket-perf my-6" />

          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div className="rounded-lg border border-white/10 bg-surface/50 p-4">
              <span className="font-mono text-xs font-bold text-white">01. FREE & ACCESSIBLE</span>
              <p className="mt-1 text-xs text-text-secondary/70">
                Built specifically for university students with zero paywalls.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-surface/50 p-4">
              <span className="font-mono text-xs font-bold text-white">02. ADAPTIVE AI</span>
              <p className="mt-1 text-xs text-text-secondary/70">
                Live scoring, real-time follow-ups, and panel rebuttals.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-surface/50 p-4">
              <span className="font-mono text-xs font-bold text-white">03. PRIVACY FIRST</span>
              <p className="mt-1 text-xs text-text-secondary/70">
                Your data is never sold or shared with external recruiters.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              to={accessToken ? "/dashboard" : "/register"}
              className="inline-flex items-center justify-center rounded-lg bg-gold px-6 py-2.5 font-heading text-sm font-semibold text-[#0B0A14] hover:bg-gold-dark"
            >
              {accessToken ? "Go to Dashboard" : "Start Practicing Now"}
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 px-5 py-2.5 font-mono text-xs text-text-primary hover:bg-stamp-navy/5"
            >
              Get in Touch →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
