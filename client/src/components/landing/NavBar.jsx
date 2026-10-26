import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils.js";
import PraepPassLogo from "../PraepPassLogo.jsx";
import { ArrowRight, Menu, X, Activity, Cpu } from "lucide-react";

const NAV_ITEMS = [
  { label: "Capabilities", href: "#features", isAnchor: true },
  { label: "Evaluation Engine", to: "/how-it-works" },
  { label: "ML Telemetry", to: "/interview" },
  { label: "Company Suites", to: "/company-prep" },
  { label: "Pricing & Pass", href: "#pricing", isAnchor: true },
  { label: "Inquiries", to: "/contact" },
];

export default function NavBar({ accessToken }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);

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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 px-4 sm:px-6">
      <div
        className={cn(
          "max-w-7xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-xl border border-slate-300/80 shadow-[0_10px_35px_rgba(15,23,42,0.08)]"
            : "bg-white/85 backdrop-blur-md border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)]"
        )}
      >
        {/* Brand Logo with Modern Typographic Ligature */}
        <Link to="/" className="transition-transform duration-200 hover:scale-[1.02]">
          <PraepPassLogo size="md" />
        </Link>

        {/* Live ML Telemetry Status Pill (Like ÆtherTransit's Live GPS Status) */}
        <div className="hidden xl:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/90 text-emerald-800 text-[11px] font-mono font-bold shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>AI TELEMETRY ACTIVE • Latency &lt; 15ms</span>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const isActive = item.isAnchor
              ? activeSection === item.href.substring(1)
              : location.pathname === item.to;
            return item.isAnchor ? (
              <a
                key={item.label}
                href={location.pathname === "/" ? item.href : `/${item.href}`}
                className={cn(
                  "font-mono text-xs uppercase tracking-wider font-semibold transition-colors duration-200 py-1",
                  isActive
                    ? "text-blue-600 font-bold border-b-2 border-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                )}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "font-mono text-xs uppercase tracking-wider font-semibold transition-colors duration-200 py-1",
                  isActive
                    ? "text-blue-600 font-bold border-b-2 border-blue-600"
                    : "text-slate-600 hover:text-blue-600"
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
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-xs font-bold tracking-wider uppercase bg-slate-900 text-white hover:bg-blue-600 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>{accessToken ? "Candidate Portal" : "Sign In"}</span>
            <ArrowRight size={14} className="text-cyan-400" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-slate-800 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 bg-white/98 backdrop-blur-xl border border-slate-200 rounded-2xl px-6 py-6 space-y-4 shadow-xl">
          {NAV_ITEMS.map((item) => (
            <div key={item.label}>
              {item.isAnchor ? (
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block font-mono text-xs uppercase tracking-wider text-slate-800 hover:text-blue-600 py-1.5"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="block font-mono text-xs uppercase tracking-wider text-slate-800 hover:text-blue-600 py-1.5"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <div className="pt-2">
            <Link
              to={accessToken ? "/dashboard" : "/login"}
              onClick={() => setMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-sans text-xs font-bold tracking-wider uppercase bg-slate-900 text-white hover:bg-blue-600 transition-colors"
            >
              <span>{accessToken ? "Candidate Portal" : "Sign In"}</span>
              <ArrowRight size={14} className="text-cyan-400" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
