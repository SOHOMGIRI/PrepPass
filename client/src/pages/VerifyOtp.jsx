import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api/axiosClient.js";
import PraepPassLogo from "../components/PraepPassLogo.jsx";
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

const OTP_LENGTH = 6;
const COOLDOWN = 30;

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const inputsRef = useRef([]);
  const [values, setValues] = useState(Array(OTP_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  useEffect(() => {
    setCooldown(COOLDOWN);
  }, []);

  useEffect(() => {
    if (!cooldown) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4">
        <div className="ticket-card w-full max-w-sm p-8 text-center border border-[#0A1128]/10 shadow-card">
          <p className="text-[#0A1128] font-mono text-sm mb-4">No verification target found.</p>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="inline-flex items-center justify-center rounded-xl font-heading text-xs font-bold uppercase tracking-wider text-white bg-[#0A1128] hover:bg-[#1E293B] py-3 px-6 shadow-sm"
          >
            Register Candidate Pass
          </button>
        </div>
      </div>
    );
  }

  const focusInput = (i) => inputsRef.current[i]?.focus();

  const handleChange = (i) => (ev) => {
    const val = ev.target.value;
    if (!/^\d*$/.test(val)) return;
    const digit = val.slice(-1);
    const next = [...values];
    next[i] = digit;
    setValues(next);
    if (digit && i < OTP_LENGTH - 1) focusInput(i + 1);
  };

  const handleKeyDown = (i) => (ev) => {
    if (ev.key === "Backspace") {
      if (values[i]) {
        const next = [...values];
        next[i] = "";
        setValues(next);
      } else if (i > 0) {
        focusInput(i - 1);
      }
    } else if (ev.key === "ArrowLeft" && i > 0) {
      focusInput(i - 1);
    } else if (ev.key === "ArrowRight" && i < OTP_LENGTH - 1) {
      focusInput(i + 1);
    }
  };

  const handlePaste = (ev) => {
    ev.preventDefault();
    const pasted = ev.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = [...values];
    pasted.split("").forEach((d, idx) => {
      next[idx] = d;
    });
    setValues(next);
    const last = pasted.length - 1;
    if (last < OTP_LENGTH - 1) focusInput(last + 1);
  };

  const isComplete = values.every((v) => v !== "");

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setError("");
    if (!isComplete) {
      setError("Please input the full 6-digit security token.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(
        "/auth/verify-otp",
        { email, otp: values.join("") },
        { skipAuthRefresh: true }
      );
      navigate("/login", { replace: true, state: { verified: true } });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Verification token invalid or expired."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    setResending(true);
    setError("");
    try {
      await api.post("/auth/resend-otp", { email }, { skipAuthRefresh: true });
      setInfo("A new single-use token has been dispatched.");
      setCooldown(COOLDOWN);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not re-issue verification code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4 py-16">
      <div className="ticket-card w-full max-w-md p-8 sm:p-10 border border-[#C5A059]/35 shadow-card">
        {/* Brand Header */}
        <div className="text-center pb-6 border-b border-[#0A1128]/8 mb-6">
          <PraepPassLogo size="md" showTagline={true} className="justify-center" />
          <p className="font-mono text-xs text-slate-500 uppercase tracking-widest mt-3 font-semibold">
            Single-Use Token Verification
          </p>
        </div>

        <h1 className="text-2xl font-heading font-extrabold text-[#0A1128] mb-1">
          Verify Identity
        </h1>
        <p className="text-slate-600 text-sm mb-6">
          Enter the 6-digit credential dispatched to{" "}
          <strong className="text-[#0A1128] font-mono">{email}</strong>.
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex justify-center gap-2.5">
            {values.map((_, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={values[i]}
                onChange={handleChange(i)}
                onKeyDown={handleKeyDown(i)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                disabled={submitting}
                className="w-12 h-14 text-center text-2xl font-mono font-bold text-[#0A1128] border-2 border-[#0A1128]/15 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] shadow-2xs transition-all"
              />
            ))}
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 font-mono text-xs text-red-700 flex items-center justify-center gap-2">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
          {info && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-mono text-xs text-emerald-800 flex items-center justify-center gap-2">
              <CheckCircle2 size={14} />
              <span>{info}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !isComplete}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-heading text-xs font-bold uppercase tracking-wider bg-[#0A1128] text-white hover:bg-[#1E293B] shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <span>{submitting ? "Validating Token…" : "Confirm Candidate Admission"}</span>
            <ArrowRight size={15} className="text-[#C5A059]" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Did not receive token?{" "}
          {cooldown > 0 ? (
            <span className="font-mono text-[#0A1128] font-bold">
              Resend available in {cooldown}s
            </span>
          ) : resending ? (
            <span className="font-mono text-[#0A1128]">Transmitting…</span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              className="text-[#0A1128] font-bold hover:text-[#C5A059] underline ml-1"
            >
              Re-issue token
            </button>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-[#0A1128]/8 text-center">
          <Link
            to="/login"
            className="text-xs font-mono text-slate-500 hover:text-[#0A1128] font-semibold"
          >
            ← Back to Candidate Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
