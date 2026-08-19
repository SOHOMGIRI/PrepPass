import { Link } from "react-router-dom";

const FOOTER_LINKS = [
  { label: "How It Works", to: "/how-it-works" },
  { label: "About", to: "/about" },
  { label: "Careers", to: "/careers" },
  { label: "Privacy", to: "/privacy" },
  { label: "Terms", to: "/terms" },
  { label: "Contact", to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="py-10 border-t border-stamp-navy/10 bg-cream/50">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="font-mono text-[11px] text-stamp-navy/50">
          © 2026 PREPPASS
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-mono text-[11px] uppercase text-stamp-navy/60 hover:text-stamp-navy tracking-wider transition"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
