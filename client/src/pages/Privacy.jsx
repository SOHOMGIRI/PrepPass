import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/landing/Footer.jsx";

export default function Privacy() {
  const { accessToken } = useAuth();

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

        {/* Policy Document Ticket */}
        <div className="ticket-card mt-8 p-6 sm:p-10 space-y-6">
          <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy">
            LEGAL · PRIVACY POLICY
          </div>

          <h1 className="font-heading text-3xl text-stamp-navy sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="font-mono text-xs text-stamp-navy/50">
            Last Updated: August 2026
          </p>

          <div className="ticket-perf my-6" />

          <div className="space-y-6 text-sm text-ink/80 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-heading text-lg text-stamp-navy">
                1. Information We Collect
              </h2>
              <p>
                When you use PrepPass, we collect information necessary to provide our placement preparation services:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>
                  <strong>Account Information:</strong> Your name and email address when you register.
                </li>
                <li>
                  <strong>Resume Data:</strong> Text extracted from uploaded PDF/DOCX resumes or resume builder drafts to compute ATS compliance, identify skill gaps, and suggest interview subjects.
                </li>
                <li>
                  <strong>Practice Session Responses:</strong> User answers submitted during mock interviews, group discussion opening arguments, and job descriptions used for resume matching.
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-lg text-stamp-navy">
                2. How We Use Your Information
              </h2>
              <p>
                Your data is used strictly for educational and preparation purposes:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Generating real-time AI scoring, feedback, and follow-up questions.</li>
                <li>Auditing resume formatting and computing ATS compatibility scores.</li>
                <li>Saving your personal interview logs and readiness scores in your history.</li>
                <li>Authenticating user sessions and preventing abusive rate limits.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-lg text-stamp-navy">
                3. Third-Party Sharing & Data Security
              </h2>
              <p>
                We do not sell, rent, or trade your personal data, resumes, or interview responses with third-party advertisers or recruitment agencies.
              </p>
              <p className="text-xs">
                AI evaluation is conducted via secure API calls to Google Gemini models in stateless requests. Raw resume files and extracted text from the ATS analyzer are processed in memory and never permanently persisted to raw file storage.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-lg text-stamp-navy">
                4. Data Retention & Deletion Requests
              </h2>
              <p>
                You have full control over your data. You may request the deletion of your account, saved resume drafts, and interview session histories at any time by contacting us through our{" "}
                <Link to="/contact" className="text-stamp-navy font-semibold underline">
                  Contact Form
                </Link>{" "}
                or emailing <code className="font-mono text-xs">contact@preppass.app</code>.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
