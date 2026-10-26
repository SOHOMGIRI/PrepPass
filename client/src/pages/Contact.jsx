import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axiosClient.js";
import Footer from "../components/landing/Footer.jsx";
import PraepPassLogo from "../components/PraepPassLogo.jsx";
import { Mail, ArrowRight, ArrowLeft, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function Contact() {
  const { accessToken } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please specify your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please specify a valid candidate email.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Your message must contain at least 10 characters.");
      return;
    }

    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await api.post("/contact", {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setSuccess(
        data.message || "Your inquiry has been logged. Our admissions desk will respond shortly."
      );
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not transmit message. Please contact admissions@praeppass.app directly."
      );
    } finally {
      setBusy(false);
    }
  };

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

        <div className="ticket-card mt-8 p-6 sm:p-10 space-y-6 border border-[#C5A059]/35 shadow-card">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#9E7B35] bg-[#C5A059]/10 px-2.5 py-1 rounded border border-[#C5A059]/20">
              DIRECT DISPATCH · INQUIRIES
            </span>
            <span className="font-mono text-xs text-slate-400">
              admissions@praeppass.app
            </span>
          </div>

          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#0A1128]">
              Contact Pr<span className="text-[#C5A059] font-serif">æ</span>pPass
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed font-normal">
              Have inquiries regarding institutional campus accreditation, customized question sets, or platform integrity? Submit your message to the executive desk.
            </p>
          </div>

          <div className="ticket-perf my-6" />

          {success && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 font-mono text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-700" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 font-mono text-xs text-red-700 flex items-center gap-2">
              <AlertCircle size={16} className="text-red-700" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-[11px] font-bold tracking-wider text-[#0A1128] mb-1.5 uppercase">
                  Candidate Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. SOHOM GIRI"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={busy}
                  className="w-full rounded-xl border border-[#0A1128]/10 bg-white px-4 py-3 text-sm text-[#0A1128] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] shadow-2xs"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] font-bold tracking-wider text-[#0A1128] mb-1.5 uppercase">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="candidate@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                  className="w-full rounded-xl border border-[#0A1128]/10 bg-white px-4 py-3 text-sm text-[#0A1128] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-bold tracking-wider text-[#0A1128] mb-1.5 uppercase">
                Inquiry Details *
              </label>
              <textarea
                rows={5}
                placeholder="State your question, institutional inquiry, or curriculum feedback in detail…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={busy}
                className="w-full rounded-xl border border-[#0A1128]/10 bg-white p-4 text-sm text-[#0A1128] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] leading-relaxed shadow-2xs"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3">
              <span className="text-xs text-slate-500 font-mono">
                Average executive response latency: &lt; 24 hours.
              </span>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1128] px-7 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1E293B] shadow-sm transition disabled:opacity-50"
              >
                <span>{busy ? "Transmitting…" : "Transmit Inquiry"}</span>
                <Send size={13} className="text-[#C5A059]" />
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
