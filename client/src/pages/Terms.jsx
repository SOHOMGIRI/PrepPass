import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/landing/Footer.jsx";
import PraepPassLogo from "../components/PraepPassLogo.jsx";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Terms() {
  const { accessToken } = useAuth();

  return (
    <div className="min-h-screen bg-transparent relative z-10 flex flex-col justify-between font-body text-slate-700">
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

        <div className="ticket-card mt-8 p-6 sm:p-10 space-y-6 border border-[#C5A059]/35 shadow-card">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 font-mono text-[10px] uppercase tracking-widest text-[#0A1128] font-bold">
            <ShieldCheck size={12} className="text-[#C5A059]" />
            <span>TERMS OF CANDIDATE ASSESSMENT</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0A1128]">
            Terms of Service
          </h1>
          <p className="font-mono text-xs text-slate-400">
            Certified Standard: {new Date().getFullYear()} Edition
          </p>

          <div className="ticket-perf my-6" />

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-normal">
            <section className="space-y-2">
              <h2 className="font-heading text-base font-bold text-[#0A1128]">
                1. Acceptance of Assessment Terms
              </h2>
              <p>
                By accessing PræpPass or initializing a candidate assessment pass, you agree to abide by these terms. The platform is designed strictly for academic preparation, mock interviewing, and diagnostic assessment.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-base font-bold text-[#0A1128]">
                2. Academic Integrity & Proctored Tests
              </h2>
              <p>
                Proctored Test Mode incorporates browser fullscreen assertions and tab focus monitors to calculate trust ratings. Candidates agree not to tamper with client proctoring sensors or attempt automated script submissions.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-base font-bold text-[#0A1128]">
                3. Diagnostic Feedback Accuracy
              </h2>
              <p>
                Acoustic prosody scores and AI examiner feedback represent diagnostic simulations intended to aid preparation. While modeled after leading corporate recruitment rubrics, they do not guarantee commercial employment outcomes.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
