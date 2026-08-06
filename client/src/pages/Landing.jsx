import { useAuth } from "../context/AuthContext.jsx";
import NavBar from "../components/landing/NavBar.jsx";
import Hero from "../components/landing/Hero.jsx";
import HowItWorks from "../components/landing/HowItWorks.jsx";
import AdmitCard from "../components/landing/AdmitCard.jsx";
import { Link } from "react-router-dom";

function PricingSection() {
  return (
    <section id="pricing" className="py-16 bg-cream">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-heading text-stamp-navy text-center mb-10">
          Pricing
        </h2>
        <div className="ticket-card relative p-8 sm:p-10">
          <div className="ticket-perf mb-8" />
          <div className="text-center mb-8">
            <span className="font-heading text-5xl text-stamp-navy">Free</span>
            <p className="text-sm text-ink/60 mt-2">No credit card required</p>
          </div>
          <ul className="space-y-3 text-sm text-ink/80 font-mono mb-10 max-w-md mx-auto">
            <li className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-gold rounded-full" />
              Unlimited mock interviews
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-gold rounded-full" />
              Instant AI scoring
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-gold rounded-full" />
              Resume-to-JD matching
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 bg-gold rounded-full" />
              Readiness grades you can rehearse with
            </li>
          </ul>
          <div className="text-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-lg font-heading font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2 text-white bg-gold hover:bg-gold-dark px-8 py-3.5"
            >
              Register now
            </Link>
          </div>
          <div className="ticket-perf mt-8" />
          <div className="absolute top-4 right-4 ticket-stamp px-2 py-1 rounded text-stamp-navy font-mono text-[9px]">
            FREE TIER
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-16 bg-ticket">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="font-heading text-stamp-navy text-center mb-10">
          Contact
        </h2>
        <div className="ticket-card relative p-8 sm:p-10">
          <div className="ticket-perf mb-8" />
          <div className="text-center">
            <h3 className="font-heading text-2xl text-stamp-navy mb-3">
              Get in touch
            </h3>
            <p className="text-sm text-ink/60 mb-6">
              Questions, feedback, or partnership ideas — drop us a line and
              we&apos;ll get back to you.
            </p>
            <a
              href="mailto:contact@preppass.app"
              className="inline-flex items-center justify-center rounded-lg font-heading font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2 text-white bg-gold hover:bg-gold-dark px-8 py-3.5"
            >
              contact@preppass.app
            </a>
          </div>
          <div className="ticket-perf mt-8" />
          <div className="absolute top-4 right-4 ticket-stamp px-2 py-1 rounded text-stamp-navy font-mono text-[9px]">
            SUPPORT
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const { accessToken } = useAuth();

  return (
    <main className="w-full bg-cream text-ink font-body">
      <NavBar accessToken={accessToken} />
      <Hero accessToken={accessToken} />
      <HowItWorks />
      <AdmitCard />
      <PricingSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
