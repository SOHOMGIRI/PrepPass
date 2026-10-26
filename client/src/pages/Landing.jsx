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
import { Check, ShieldCheck, Mail, ArrowRight, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PricingSection = forwardRef((props, ref) => {
  return (
    <section id="pricing" className="py-20 bg-transparent">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1128]/5 border border-[#0A1128]/10 text-navy-900 font-mono text-[10px] uppercase tracking-widest font-bold mb-3">
            ASSESSMENT ACCESS
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0A1128]">
            Scholastic Candidate Pass
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Full platform capabilities are unlocked for registered candidates.
          </p>
        </div>

        <div
          ref={ref}
          className="ticket-card relative p-8 sm:p-12 overflow-hidden border border-[#C5A059]/40"
        >
          {/* Top Perforation */}
          <div className="ticket-perf mb-8" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-[#0A1128]/8">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#9E7B35]">
                FOUNDATIONAL SCHOLASTIC TIER
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-heading text-5xl font-black text-[#0A1128]">₹0</span>
                <span className="text-sm font-mono text-slate-500">/ 100% Complimentary</span>
              </div>
            </div>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-heading text-xs font-bold uppercase tracking-wider bg-[#0A1128] text-white hover:bg-[#1E293B] shadow-imperial transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Initialize Candidate Pass</span>
              <ArrowRight size={15} className="text-[#C5A059]" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 my-8">
            {[
              "Unlimited AI Mock Interviews with Live Prosody HUD",
              "Proctored Test Mode with Focus Violation Tracking",
              "Acoustic Cadence (WPM) & Filler Word Analytics",
              "ATS Resume Matcher & Google X-Y-Z Optimizer",
              "Group Discussion Practice Arena with AI Rebuttal",
              "Curated Company Tracks (FAANG & IT Services)",
              "Peer Percentile Rankings & Readiness Growth Curves",
              "Automated Flashcard Revision Decks for Missed MCQs",
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                <div className="w-5 h-5 rounded-full bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-dashed border-[#0A1128]/15 bg-[#FDFBF7] -mx-8 -mb-12 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#C5A059]/15 text-[#9E7B35] flex items-center justify-center shrink-0">
                <Sparkles size={18} />
              </div>
              <div className="text-xs text-slate-600">
                <strong className="text-[#0A1128]">Optional Comprehensive Dossier:</strong> In-depth diagnostic report download available on-demand via UPI voucher verification.
              </div>
            </div>
            <div className="font-mono text-xs font-bold text-[#0A1128] bg-white px-3 py-1.5 rounded border border-[#0A1128]/10 shadow-2xs">
              SECURE LEDGER
            </div>
          </div>

          {/* Badge */}
          <div className="absolute top-4 right-4 ticket-stamp px-2.5 py-1 rounded text-[#0A1128] font-mono text-[10px] font-bold">
            STANDARD PASS
          </div>
        </div>
      </div>
    </section>
  );
});

const ContactSection = forwardRef((props, ref) => {
  return (
    <section id="contact" className="py-20 bg-transparent">
      <div className="max-w-3xl mx-auto px-6">
        <div ref={ref} className="ticket-card relative p-8 sm:p-10 text-center">
          <div className="ticket-perf mb-6" />
          <div className="w-12 h-12 rounded-2xl bg-[#0A1128] text-[#C5A059] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Mail size={22} />
          </div>
          <h3 className="font-heading text-2xl font-bold text-[#0A1128] mb-2">
            Direct Candidate & Campus Inquiries
          </h3>
          <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
            Have questions regarding assessment accreditation, university campus partnerships, or platform integrity?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-heading text-xs font-bold uppercase tracking-wider bg-[#0A1128] text-white hover:bg-[#1E293B] shadow-sm transition-all"
            >
              <span>Submit Inquiry Form</span>
              <ArrowRight size={14} className="text-[#C5A059]" />
            </Link>
            <a
              href="mailto:admissions@praeppass.app"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-xs font-semibold border border-[#0A1128]/15 text-[#0A1128] hover:bg-[#0A1128]/5 transition-colors"
            >
              admissions@praeppass.app
            </a>
          </div>
          <div className="ticket-perf mt-8" />
        </div>
      </div>
    </section>
  );
});

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
    <main className="w-full bg-[#FDFBF7] text-[#0A1128] font-body selection:bg-[#C5A059]/20 selection:text-[#0A1128]">
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
