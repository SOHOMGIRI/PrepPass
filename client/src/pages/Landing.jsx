import { useAuth } from "../context/AuthContext.jsx";
import NavBar from "../components/landing/NavBar.jsx";
import Hero from "../components/landing/Hero.jsx";
import HowItWorks from "../components/landing/HowItWorks.jsx";
import AdmitCard from "../components/landing/AdmitCard.jsx";
import Footer from "../components/landing/Footer.jsx";
import { Link } from "react-router-dom";
import { useEffect, useRef, forwardRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, ShieldCheck, Mail, ArrowRight, Sparkles, Zap, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PricingSection = forwardRef((props, ref) => {
  return (
    <section id="pricing" className="py-24 bg-transparent relative z-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-[10px] uppercase tracking-widest font-bold mb-3 shadow-2xs">
            <Zap size={12} className="text-blue-600" />
            COMPLIMENTARY ACCESS
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Accredited Candidate Pass
          </h2>
          <p className="mt-2 text-slate-600 text-sm max-w-lg mx-auto">
            Full platform intelligence capabilities are unlocked for registered engineering candidates.
          </p>
        </div>

        <div
          ref={ref}
          className="relative p-8 sm:p-12 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.06),0_0_0_1px_rgba(37,99,235,0.08)] overflow-hidden"
        >
          {/* Top Decorative Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
                <Award size={14} />
                FULL SCHOLASTIC TIER
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-sans text-5xl font-black text-slate-900">₹0</span>
                <span className="text-sm font-mono text-slate-500">/ 100% Free &amp; Open Access</span>
              </div>
            </div>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-blue-600 shadow-md hover:shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Initialize Candidate Pass</span>
              <ArrowRight size={15} className="text-cyan-400" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 my-8">
            {[
              "Unlimited Dynamic AI Mock Interviews (Gemini 2.0)",
              "Real-Time Item Response Theory (IRT) Adaptive Branching",
              "Acoustic Speech Prosody HUD (Live Decibels & WPM)",
              "Proctored Test Mode with Focus Violation Tracking",
              "ATS Resume Matcher & Google X-Y-Z Optimizer",
              "Group Discussion Practice Arena with AI Rebuttal",
              "FAANG & Enterprise Prep Tracks (Google, Amazon, TCS)",
              "Peer Percentile Rankings & Readiness Growth Curves",
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="font-medium">{feat}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 bg-slate-50/70 -mx-8 -mb-12 p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Sparkles size={18} />
              </div>
              <div className="text-xs text-slate-600">
                <strong className="text-slate-900">Comprehensive Placement Dossier:</strong> In-depth diagnostic report generation with vector similarity score breakdown and peer ranking ledger.
              </div>
            </div>
            <div className="font-mono text-xs font-bold text-slate-800 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs shrink-0">
              SECURE LEDGER
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

PricingSection.displayName = "PricingSection";

const ContactSection = forwardRef((props, ref) => {
  return (
    <section id="contact" className="py-20 bg-transparent relative z-10">
      <div className="max-w-3xl mx-auto px-6">
        <div ref={ref} className="p-8 sm:p-10 rounded-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.06)] text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Mail size={22} />
          </div>
          <h3 className="font-sans text-2xl font-bold text-slate-900 mb-2">
            Direct Candidate &amp; Campus Inquiries
          </h3>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            Have questions regarding assessment accreditation, university campus partnerships, or platform integrity?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-wider bg-slate-900 text-white hover:bg-blue-600 shadow-md hover:shadow-blue-500/25 transition-all"
            >
              <span>Submit Inquiry Form</span>
              <ArrowRight size={14} className="text-cyan-400" />
            </Link>
            <a
              href="mailto:admissions@praeppass.app"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              admissions@praeppass.app
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = "ContactSection";

export default function Landing() {
  const { accessToken } = useAuth();
  const pricingRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    if (pricingRef.current) {
      gsap.fromTo(
        pricingRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: pricingRef.current, start: "top 85%", once: true },
        }
      );
    }

    if (contactRef.current) {
      gsap.fromTo(
        contactRef.current,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: contactRef.current, start: "top 85%", once: true },
        }
      );
    }

    return () => ScrollTrigger.getAll().forEach((st) => st.kill());
  }, []);

  return (
    <main className="w-full bg-transparent text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <NavBar accessToken={accessToken} />
      <Hero accessToken={accessToken} />
      <HowItWorks />
      <AdmitCard />
      <PricingSection ref={pricingRef} />
      <ContactSection ref={contactRef} />
      <Footer />
    </main>
  );
}
