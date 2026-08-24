import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axiosClient.js";

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

  // Assume an OTP was just sent during registration -> start cooldown.
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
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="ticket-card w-full max-w-sm p-8 text-center">
          <p className="text-white font-mono mb-4">No email found.</p>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="inline-flex items-center justify-center rounded-lg font-semibold text-white bg-stamp-navy hover:bg-stamp-navy/90 focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2 py-2 px-4"
          >
            Go to Register
          </button>
        </div>
      </div>
    );
  }

  const focusInput = (i) => inputsRef.current[i]?.focus();

  const handleChange = (i) => (ev) => {
    const val = ev.target.value;
    if (!/^\d*$/.test(val)) return; // digits only
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
      setError("Please enter the 6-digit code.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post(
        "/auth/verify-otp",
        { email, otp: values.join("") },
        { skipAuthRefresh: true }
      );
      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Verification failed. Please try again."
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
      setInfo("A new code has been sent.");
      setCooldown(COOLDOWN);
    } catch (err) {
      setError(err?.response?.data?.message || "Could not resend the code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="ticket-card w-full max-w-md p-8">
        <div className="ticket-stamp inline-block px-3 py-1 rounded text-text-primary font-mono text-xs mb-6">
          PREPPASS — OTP VERIFICATION
        </div>
        <h1 className="text-2xl font-heading text-text-primary mb-1">
          Enter your code.
        </h1>
        <p className="text-text-secondary/60 text-sm mb-6">
          We sent a 6-digit code to{" "}
          <span className="font-mono text-text-primary">{email}</span>.
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
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
                className="w-12 h-12 text-center text-xl font-mono font-semibold text-text-primary border-2 border-white/10 rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-stamp-navy/30 focus:border-gold"
              />
            ))}
          </div>

          {error && (
            <p className="text-white text-xs font-mono text-center">{error}</p>
          )}
          {info && (
            <p className="text-text-primary/70 text-xs font-mono text-center">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !isComplete}
            className="inline-flex items-center justify-center rounded-lg font-semibold text-white bg-stamp-navy hover:bg-stamp-navy/90 focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2 w-full py-3"
          >
            {submitting ? "Verifying…" : "Verify & Continue"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary/70">
          Didn't get the code?{" "}
          {cooldown > 0 ? (
            <span className="font-mono text-text-primary">
              Resend in {cooldown}s
            </span>
          ) : resending ? (
            <span className="font-mono text-text-primary">Resending…</span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              className="text-text-primary font-medium hover:underline"
            >
              Resend code
            </button>
          )}
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate("/login", { replace: true })}
            className="text-xs text-text-secondary/60 hover:text-text-primary"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}