import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axiosClient.js";
import Footer from "../components/landing/Footer.jsx";

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
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (message.trim().length < 10) {
      setError("Please enter a message of at least 10 characters.");
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
        data.message || "Thank you! Your message has been sent successfully."
      );
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Could not send your message. Please try again or email contact@preppass.app directly."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-between font-body text-ink">
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="font-heading text-lg font-bold text-stamp-navy hover:opacity-80"
          >
            PREPPASS
          </Link>
          <Link
            to={accessToken ? "/dashboard" : "/login"}
            className="font-mono text-xs uppercase tracking-wider text-stamp-navy hover:underline"
          >
            {accessToken ? "Dashboard →" : "Sign In →"}
          </Link>
        </div>

        <div className="ticket-card mt-8 p-6 sm:p-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy">
              GET IN TOUCH · SUPPORT
            </div>
            <span className="font-mono text-xs text-stamp-navy/50">
              contact@preppass.app
            </span>
          </div>

          <div>
            <h1 className="font-heading text-3xl text-stamp-navy sm:text-4xl">
              Contact PrepPass
            </h1>
            <p className="mt-2 text-sm text-ink/70 leading-relaxed">
              Have questions, feedback about an interview question, or partnership ideas? Send us a message and our team will get back to you shortly.
            </p>
          </div>

          <div className="ticket-perf my-6" />

          {success && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 font-mono text-xs text-green-800">
              ✓ {success}
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-gold/10 border border-stamp-maroon/20 p-4 font-mono text-xs text-stamp-maroon">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block font-mono text-xs text-stamp-navy/70 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sohom Giri"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={busy}
                  className="w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-sm text-ink focus:border-stamp-navy focus:outline-none focus:ring-2 focus:ring-stamp-navy/20 disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-stamp-navy/70 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                  className="w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-sm text-ink focus:border-stamp-navy focus:outline-none focus:ring-2 focus:ring-stamp-navy/20 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs text-stamp-navy/70 mb-1">
                Your Message *
              </label>
              <textarea
                rows={5}
                placeholder="How can we help you? Share your questions, feedback, or suggestions…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={busy}
                className="w-full rounded-lg border border-ink/20 bg-white p-4 text-sm text-ink focus:border-stamp-navy focus:outline-none focus:ring-2 focus:ring-stamp-navy/20 leading-relaxed disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <p className="text-xs text-ink/50 font-mono">
                We typically respond within 24 hours.
              </p>
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center justify-center rounded-lg bg-stamp-navy px-6 py-2.5 font-heading text-sm font-semibold text-white hover:bg-stamp-navy/90 disabled:opacity-50"
              >
                {busy ? "Sending Message…" : "Send Message"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
