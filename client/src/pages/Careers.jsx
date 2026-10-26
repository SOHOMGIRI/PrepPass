import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/landing/Footer.jsx";
import PraepPassLogo from "../components/PraepPassLogo.jsx";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Careers() {
  const { accessToken } = useAuth();

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between font-body text-slate-700">
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
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

        <div className="ticket-card mt-8 p-6 sm:p-12 text-center space-y-6 border border-[#C5A059]/35 shadow-card">
          <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#9E7B35] bg-[#C5A059]/10 px-2.5 py-1 rounded border border-[#C5A059]/20">
            TALENT & SCHOLASTIC COHORTS
          </span>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0A1128]">
            Engineering Cohort Status
          </h1>

          <p className="mx-auto max-w-xl text-sm text-slate-600 leading-relaxed font-normal">
            PræpPass is an independent engineering initiative built by <strong>SOHOM GIRI</strong> to establish an accredited assessment benchmark for university students and software engineering candidates worldwide.
          </p>

          <div className="ticket-perf my-6" />

          <div className="mx-auto max-w-md rounded-2xl border border-[#0A1128]/8 bg-[#FDFBF7] p-6 text-left space-y-3 shadow-2xs">
            <h2 className="font-heading text-base font-bold text-[#0A1128]">
              Collaborate or Propose Research Tracks?
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              If you have suggestions for novel real-time telemetry heuristics, new company tracks, or campus partnership pilots, we welcome your direct inquiry.
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0A1128] px-5 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1E293B] shadow-sm transition"
              >
                <span>Direct Inquiries</span>
                <ArrowRight size={13} className="text-[#C5A059]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
