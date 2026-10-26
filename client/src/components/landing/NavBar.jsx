import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils.js";
import PraepPassLogo from "../PraepPassLogo.jsx";
import { ArrowRight, Menu, X, Sparkles } from "lucide-react";

const NAV_ITEMS = [
  { label: "Capabilities", href: "#features", isAnchor: true },
  { label: "Evaluation System", to: "/how-it-works" },
  { label: "Scholastic Charter", to: "/about" },
  { label: "Company Suites", to: "/company-prep" },
  { label: "Imperial Pass", href: "#pricing", isAnchor: true },
  { label: "Direct Inquiries", to: "/contact" },
];

export default function NavBar({ accessToken }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (location.pathname === "/") {
        const sections = NAV_ITEMS.filter((i) => i.isAnchor).map((i) => i.href.substring(1));
        let current = "";
        for (const sec of sections) {
          const el = document.getElementById(sec);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.35 && rect.bottom >= window.innerHeight * 0.35) {
              current = sec;
            }
          }
        }
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#0A1128]/8 py-3 shadow-[0_4px_20px_rgba(10,17,40,0.04)]"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6">
        {/* Brand Logo with Typographic Ligature */}
        <PraepPassLogo size="md" showTagline={false} />

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = item.isAnchor
              ? activeSection === item.href.substring(1)
              : location.pathname === item.to;
            return item.isAnchor ? (
              <a
                key={item.label}
                href={location.pathname === "/" ? item.href : `/${item.href}`}
                className={cn(
                  "animated-underline font-mono text-[11px] uppercase tracking-wider font-semibold transition-colors duration-200",
                  isActive ? "text-[#0A1128] font-bold" : "text-slate-500 hover:text-[#0A1128]"
                )}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "animated-underline font-mono text-[11px] uppercase tracking-wider font-semibold transition-colors duration-200",
                  isActive ? "text-[#0A1128] font-bold" : "text-slate-500 hover:text-[#0A1128]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            to={accessToken ? "/dashboard" : "/login"}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-heading text-xs font-bold tracking-wider uppercase bg-[#0A1128] text-[#FDFBF7] hover:bg-[#1E293B] shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{accessToken ? "Candidate Portal" : "Sign In"}</span>
            <ArrowRight size={14} className="text-[#C5A059]" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-[#0A1128] hover:bg-[#0A1128]/5 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full border-b border-[#0A1128]/10 bg-[#FDFBF7]/98 backdrop-blur-2xl shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col px-6 py-5 space-y-3.5">
            {NAV_ITEMS.map((item) => {
              const isActive = item.isAnchor
                ? activeSection === item.href.substring(1)
                : location.pathname === item.to;
              return item.isAnchor ? (
                <a
                  key={item.label}
                  href={location.pathname === "/" ? item.href : `/${item.href}`}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "font-mono text-xs uppercase tracking-wider py-1.5 transition-colors",
                    isActive ? "text-[#0A1128] font-bold" : "text-slate-600 hover:text-[#0A1128]"
                  )}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "font-mono text-xs uppercase tracking-wider py-1.5 transition-colors",
                    isActive ? "text-[#0A1128] font-bold" : "text-slate-600 hover:text-[#0A1128]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-[#0A1128]/10">
              <Link
                to={accessToken ? "/dashboard" : "/login"}
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-heading text-xs font-bold tracking-wider uppercase bg-[#0A1128] text-white"
              >
                <span>{accessToken ? "Access Candidate Dossier" : "Sign In to Portal"}</span>
                <ArrowRight size={14} className="text-[#C5A059]" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
