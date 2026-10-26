import { Link } from "react-router-dom";
import PraepPassLogo from "../PraepPassLogo.jsx";

const FOOTER_LINKS = [
  { label: "Evaluation System", to: "/how-it-works" },
  { label: "Scholastic Charter", to: "/about" },
  { label: "Careers", to: "/careers" },
  { label: "Privacy Protocol", to: "/privacy" },
  { label: "Terms of Assessment", to: "/terms" },
  { label: "Direct Inquiries", to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="py-14 border-t border-[#0A1128]/8 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <PraepPassLogo size="sm" showTagline={true} />
          <p className="font-mono text-[11px] text-slate-400 mt-2">
            © {new Date().getFullYear()} PræpPass Intelligence Ltd. All candidate rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-end">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-mono text-[11px] uppercase text-slate-500 hover:text-[#0A1128] tracking-wider transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
