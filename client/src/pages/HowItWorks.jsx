import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import SpotlightCard from "../components/landing/SpotlightCard.jsx";
import Footer from "../components/landing/Footer.jsx";
import PraepPassLogo from "../components/PraepPassLogo.jsx";
import {
  FileCheck,
  FileText,
  Mic,
  Layers,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

const STEPS = [
  {
    num: "01",
    badge: "ATS SCAN & VECTOR MATCH",
    title: "ATS Audit & Personalized Subject Recommendations",
    desc: "Submit your resume in PDF or DOCX format for an instant 0–100 ATS compliance audit, semantic keyword density analysis, and automated role subject recommendations.",
    icon: FileCheck,
  },
  {
    num: "02",
    badge: "BULLET ARCHITECT",
    title: "AI Resume Enhancement (Google X-Y-Z Standard)",
    desc: "Draft an accredited, recruiter-ready resume utilizing our guided multi-step builder with inline AI bullet refinement: 'Accomplished [X], as measured by [Y], by doing [Z]'.",
    icon: FileText,
  },
  {
    num: "03",
    badge: "ACOUSTIC SIMULATION",
    title: "Multi-Persona Board Simulation with Speech Prosody HUD",
    desc: "Rehearse with live adaptive questions probing trade-offs in real time, accompanied by live Web Audio prosody calculating WPM cadence, dead-air pauses, and filler-word detection.",
    icon: Mic,
  },
  {
    num: "04",
    badge: "SPACED REPETITION",
    title: "Automated Flashcard Concept Reinforcement",
    desc: "Transform your missed MCQ questions and low-scoring interview responses into an interactive 3D flashcard revision deck with step-by-step logic explanations.",
    icon: Layers,
  },
  {
    num: "05",
    badge: "LONGITUDINAL TELEMETRY",
    title: "Track Growth via Readiness Curves & Peer Percentiles",
    desc: "Visualize your multi-session accuracy trajectory across interviews, proctored tests, and debate rounds with normalized trend charts, and benchmark your score against peer cohorts.",
    icon: BarChart3,
  },
  {
    num: "06",
    badge: "ACCREDITED DOSSIER",
    title: "Mint Your Official Candidate Assessment Dossier",
    desc: "Synthesize full interview transcripts, acoustic prosody scores, and proctored test percentiles into a verified candidate passport that demonstrates authentic readiness.",
    icon: ShieldCheck,
  },
];

export default function HowItWorks() {
  const { accessToken } = useAuth();

  return (
    <div className="min-h-screen bg-transparent relative z-10 flex flex-col justify-between font-body text-slate-700">
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        {/* Navigation Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#0A1128]/8">
          <PraepPassLogo size="md" showTagline={false} />
          <Link
            to={accessToken ? "/dashboard" : "/login"}
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider font-bold text-[#0A1128] hover:text-[#C5A059] transition-colors"
          >
            <span>{accessToken ? "Candidate Dossier" : "Sign In"}</span>
            <ArrowRight size={13} className="text-[#C5A059]" />
          </Link>
        </div>

        {/* Hero Banner Ticket */}
        <div className="ticket-card mt-8 p-6 sm:p-10 border border-[#C5A059]/35 shadow-card">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 font-mono text-[10px] uppercase tracking-widest text-[#0A1128] font-bold">
            <ShieldCheck size={12} className="text-[#C5A059]" />
            <span>ASSESSMENT ARCHITECTURE & METHODOLOGY</span>
          </div>

          <h1 className="mt-4 font-heading text-3xl sm:text-4xl font-extrabold text-[#0A1128]">
            How Pr<span className="text-[#C5A059] font-serif">æ</span>pPass Works
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-2xl font-normal">
            A comprehensive, rigorous overview of how PræpPass enables candidates to calibrate acoustic speech cadence, master live technical cross-examinations, and audit ATS resume vectors.
          </p>

          <div className="mt-10 space-y-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <SpotlightCard key={step.num} className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0A1128] font-mono text-sm font-bold text-[#C5A059] shadow-xs">
                        {step.num}
                      </div>
                      <div>
                        <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#9E7B35] bg-[#C5A059]/10 px-2.5 py-0.5 rounded border border-[#C5A059]/20 inline-block mb-2">
                          {step.badge}
                        </span>
                        <h2 className="font-heading text-lg sm:text-xl font-bold text-[#0A1128] mb-1.5">
                          {step.title}
                        </h2>
                        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl font-normal">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A1128]/5 text-[#0A1128]">
                      <Icon size={20} />
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </div>

        {/* Call to Action Ticket */}
        <div className="ticket-card mt-12 p-8 text-center bg-white border border-[#C5A059]/40 shadow-card">
          <h3 className="font-heading text-2xl font-extrabold text-[#0A1128]">
            Initialize Your Candidate Assessment Pass
          </h3>
          <p className="mt-2 text-xs text-slate-600 max-w-md mx-auto">
            Join ambitious candidates rehearsing with acoustic speech prosody, multi-persona AI panels, and certified ATS feedback.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={accessToken ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A1128] px-7 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1E293B] shadow-sm transition"
            >
              <span>{accessToken ? "Access Dossier" : "Initialize Candidate Pass"}</span>
              <ArrowRight size={14} className="text-[#C5A059]" />
            </Link>
            <Link
              to="/company-prep"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#0A1128]/15 bg-transparent relative z-10 px-6 py-3 font-mono text-xs font-semibold text-[#0A1128] hover:bg-white shadow-2xs transition-colors"
            >
              Explore Enterprise Tracks →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
