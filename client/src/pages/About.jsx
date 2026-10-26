import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/landing/Footer.jsx";
import PraepPassLogo from "../components/PraepPassLogo.jsx";
import { ArrowLeft, ArrowRight, ShieldCheck, Award, Lock, Sparkles } from "lucide-react";

export default function About() {
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

        {/* Main Content Ticket */}
        <div className="ticket-card mt-8 p-6 sm:p-10 space-y-6 border border-[#C5A059]/35 shadow-card">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 font-mono text-[10px] uppercase tracking-widest text-[#0A1128] font-bold">
            <Award size={12} className="text-[#C5A059]" />
            <span>OUR SCHOLASTIC CHARTER & PHILOSOPHY</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0A1128]">
            The Pr<span className="text-[#C5A059] font-serif">æ</span>pPass Standard
          </h1>

          <div className="ticket-perf my-6" />

          <div className="space-y-5 text-sm text-slate-700 leading-relaxed font-normal">
            <p>
              We established <strong>PræpPass</strong> to bridge the profound chasm between academic curricula and the unforgiving reality of modern enterprise recruitment. Every recruitment cycle, ambitious candidates exhaust thousands of hours practicing disconnected problem sets, yet struggle during live architectural cross-examinations, strict ATS parser algorithms, and unstructured multi-candidate group discussions.
            </p>

            <p>
              Conventional preparation tools either impose predatory recurring subscriptions or serve static multiple-choice banks devoid of interactive context. PræpPass was conceived as an industrial-grade intelligence partner—one that parses full-fidelity resumes, performs acoustic prosody telemetry in real-time, generates dynamic follow-ups based on the candidate's actual verbal arguments, and synthesizes readiness grades into an accredited candidate passport.
            </p>

            <p>
              Our founding charter is simple: democratize elite candidate rehearsal. Whether targeting premier global tech conglomerates (Google, Amazon, Microsoft) or premier systems consultancies, PræpPass equips serious candidates with the diagnostic rigor, vocal telemetry, and algorithmic composure necessary to walk into the boardroom and claim their offer.
            </p>
          </div>

          <div className="ticket-perf my-6" />

          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <div className="rounded-xl border border-[#0A1128]/8 bg-transparent relative z-10 p-5 shadow-2xs">
              <span className="font-mono text-xs font-bold text-[#0A1128] block mb-1">
                01. ZERO COMPROMISE
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full-tier candidate assessment suites unlocked without artificial paywalls.
              </p>
            </div>
            <div className="rounded-xl border border-[#0A1128]/8 bg-transparent relative z-10 p-5 shadow-2xs">
              <span className="font-mono text-xs font-bold text-[#0A1128] block mb-1">
                02. ACOUSTIC TELEMETRY
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time Web Audio prosody measuring WPM cadence, fillers, and hesitation dead air.
              </p>
            </div>
            <div className="rounded-xl border border-[#0A1128]/8 bg-transparent relative z-10 p-5 shadow-2xs">
              <span className="font-mono text-xs font-bold text-[#0A1128] block mb-1">
                03. ZERO RETENTION
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict privacy architecture: video previews remain local; audio streams are ephemeral.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Link
              to={accessToken ? "/dashboard" : "/register"}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A1128] px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1E293B] shadow-sm transition"
            >
              <span>{accessToken ? "Access Dossier" : "Initialize Candidate Pass"}</span>
              <ArrowRight size={14} className="text-[#C5A059]" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-300/60 bg-amber-100/70 px-5 py-3 font-mono text-xs font-semibold text-amber-950 hover:bg-amber-200/80 transition-colors shadow-2xs"
            >
              Direct Academic Inquiries →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
