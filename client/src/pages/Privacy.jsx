import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/landing/Footer.jsx";
import PraepPassLogo from "../components/PraepPassLogo.jsx";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Privacy() {
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

        <div className="ticket-card mt-8 p-6 sm:p-10 space-y-6 border border-[#C5A059]/35 shadow-card">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 font-mono text-[10px] uppercase tracking-widest text-[#0A1128] font-bold">
            <ShieldCheck size={12} className="text-[#C5A059]" />
            <span>DATA INTEGRITY & PRIVACY PROTOCOL</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0A1128]">
            Privacy Protocol
          </h1>
          <p className="font-mono text-xs text-slate-400">
            Certified Standard: {new Date().getFullYear()} Edition
          </p>

          <div className="ticket-perf my-6" />

          <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-normal">
            <section className="space-y-2">
              <h2 className="font-heading text-base font-bold text-[#0A1128]">
                1. Information We Collect
              </h2>
              <p>
                When registering for a PræpPass candidate passport, we collect your name and email address. When you engage with our simulation suites, we process your interview audio and answer texts solely for real-time acoustic scoring and feedback generation.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-base font-bold text-[#0A1128]">
                2. Ephemeral Media & Camera Feed
              </h2>
              <p>
                Video posture preview feeds are rendered entirely locally within your client browser using HTML5 MediaStream APIs. Video frames are never recorded, transmitted, or stored on PræpPass servers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-base font-bold text-[#0A1128]">
                3. Zero Third-Party Monetization
              </h2>
              <p>
                Your candidate resumes, transcripts, and evaluation percentiles are strictly private. PræpPass never sells candidate rosters or assessment profiles to external advertising brokers.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
