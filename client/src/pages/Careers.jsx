import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/landing/Footer.jsx";

export default function Careers() {
  const { accessToken } = useAuth();

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-between font-body text-text-secondary">
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="font-heading text-lg font-bold text-text-primary hover:opacity-80"
          >
            PREPPASS
          </Link>
          <Link
            to={accessToken ? "/dashboard" : "/login"}
            className="font-mono text-xs uppercase tracking-wider text-text-primary hover:underline"
          >
            {accessToken ? "Dashboard →" : "Sign In →"}
          </Link>
        </div>

        {/* Content Card */}
        <div className="ticket-card mt-8 p-6 sm:p-10 text-center space-y-6">
          <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-text-primary">
            CAREERS AT PREPPASS
          </div>

          <h1 className="font-heading text-3xl text-text-primary sm:text-4xl">
            We are not actively hiring.
          </h1>

          <p className="mx-auto max-w-xl text-sm text-text-secondary/70 leading-relaxed">
            PrepPass is an independent engineering project built to empower students and graduates preparing for campus placements and technical interviews. Because this is a student project and educational platform, we do not have open employment positions at this time.
          </p>

          <div className="ticket-perf my-6" />

          <div className="mx-auto max-w-md rounded-lg border border-white/10 bg-surface/60 p-6 text-left space-y-3">
            <h2 className="font-heading text-base text-text-primary">
              Want to collaborate or share feedback?
            </h2>
            <p className="text-xs text-text-secondary/75 leading-relaxed">
              If you have ideas for new interview tracks, feedback on AI question quality, or want to contribute suggestions, we would love to hear from you!
            </p>
            <div className="pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-gold px-5 py-2.5 font-heading text-xs font-semibold text-[#0B0A14] hover:bg-gold-dark"
              >
                Send Us a Message →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
