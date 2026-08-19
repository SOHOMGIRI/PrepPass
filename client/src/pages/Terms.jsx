import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Footer from "../components/landing/Footer.jsx";

export default function Terms() {
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

        {/* Terms Document Ticket */}
        <div className="ticket-card mt-8 p-6 sm:p-10 space-y-6">
          <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy">
            LEGAL · TERMS OF USE
          </div>

          <h1 className="font-heading text-3xl text-stamp-navy sm:text-4xl">
            Terms of Service
          </h1>
          <p className="font-mono text-xs text-stamp-navy/50">
            Last Updated: August 2026
          </p>

          <div className="ticket-perf my-6" />

          <div className="space-y-6 text-sm text-ink/80 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-heading text-lg text-stamp-navy">
                1. Educational & Practice Disclaimer
              </h2>
              <p>
                PrepPass is an independent educational tool designed solely for mock interview rehearsal, resume auditing, and campus placement practice.
              </p>
              <p className="text-xs">
                All AI-generated readiness ratings, feedback notes, ATS match percentages, and interview questions are automated simulation outputs intended for self-assessment. High scores or positive feedback within PrepPass do not guarantee job offers, interview selection, or employment outcomes with any company.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-lg text-stamp-navy">
                2. Company Names & Third-Party Trademarks
              </h2>
              <p>
                Company names, logos, and recruitment track identifiers referenced within PrepPass (including but not limited to TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini, Amazon, Google, Microsoft, Flipkart, Adobe, and Swiggy) are the registered trademarks of their respective owners.
              </p>
              <p className="text-xs">
                PrepPass is not affiliated with, sponsored by, or endorsed by any of these entities. Practice round patterns represent commonly reported historical frameworks compiled for preparation purposes only.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-lg text-stamp-navy">
                3. Acceptable Use Policy
              </h2>
              <p>
                By using PrepPass, you agree to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Use the platform exclusively for lawful educational and career preparation purposes.</li>
                <li>Respect all rate limiters and avoid automated scripting or scraping of interview question banks.</li>
                <li>Refrain from uploading harmful code, malicious files, or offensive content in resumes or practice responses.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-heading text-lg text-stamp-navy">
                4. Account Responsibilities
              </h2>
              <p className="text-xs">
                You are responsible for maintaining the confidentiality of your account credentials. We reserve the right to limit access or terminate accounts that violate our acceptable use policy.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
