import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils.js";

const NAV_ITEMS = [
  { label: "Features", href: "#features", isAnchor: true },
  { label: "How It Works", to: "/how-it-works" },
  { label: "About", to: "/about" },
  { label: "Careers", to: "/careers" },
  { label: "Pricing", href: "#pricing", isAnchor: true },
  { label: "Contact", to: "/contact" },
];

export default function NavBar({ accessToken }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Simple intersection check for anchor links if on landing page
      if (location.pathname === "/") {
        const sections = NAV_ITEMS.filter(i => i.isAnchor).map(i => i.href.substring(1));
        let current = "";
        for (const sec of sections) {
          const el = document.getElementById(sec);
          if (el) {
            const rect = el.getBoundingClientRect();
            // If the top of the section is within the top 30% of viewport
            if (rect.top <= window.innerHeight * 0.3 && rect.bottom >= window.innerHeight * 0.3) {
              current = sec;
            }
          }
        }
        setActiveSection(current);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // init
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-ticket/70 backdrop-blur-md border-b border-stamp-navy/10 py-2 shadow-sm" : "bg-transparent py-4"
      )}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6">
        <Link
          to="/"
          className="font-heading text-stamp-navy text-xl font-bold mono hover:opacity-80"
        >
          PREPPASS
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-5 md:gap-6 text-sm">
          {NAV_ITEMS.map((item) => {
            const isActive = item.isAnchor ? activeSection === item.href.substring(1) : location.pathname === item.to;
            return item.isAnchor ? (
              <a
                key={item.label}
                href={location.pathname === "/" ? item.href : `/${item.href}`}
                className={cn(
                  "animated-underline font-mono text-[11px] uppercase tracking-wider transition-colors",
                  isActive ? "text-stamp-navy font-bold" : "text-stamp-navy/60 hover:text-stamp-navy"
                )}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "animated-underline font-mono text-[11px] uppercase tracking-wider transition-colors",
                  isActive ? "text-stamp-navy font-bold" : "text-stamp-navy/60 hover:text-stamp-navy"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to={accessToken ? "/dashboard" : "/login"}
            className="hidden sm:block font-mono text-[11px] uppercase text-stamp-navy hover:underline tracking-wider"
          >
            {accessToken ? "DASHBOARD" : "SIGN IN"}
          </Link>

          {/* Hamburger Menu Button */}
          <button
            className="sm:hidden text-stamp-navy"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="sm:hidden absolute top-full left-0 w-full border-t border-stamp-navy/10 bg-ticket/95 backdrop-blur-xl shadow-lg">
          <nav className="flex flex-col px-6 py-4 space-y-4">
            {NAV_ITEMS.map((item) => {
              const isActive = item.isAnchor ? activeSection === item.href.substring(1) : location.pathname === item.to;
              return item.isAnchor ? (
                <a
                  key={item.label}
                  href={location.pathname === "/" ? item.href : `/${item.href}`}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "font-mono text-[11px] uppercase tracking-wider",
                    isActive ? "text-stamp-navy font-bold" : "text-stamp-navy/70 hover:text-stamp-navy"
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
                    "font-mono text-[11px] uppercase tracking-wider",
                    isActive ? "text-stamp-navy font-bold" : "text-stamp-navy/70 hover:text-stamp-navy"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              to={accessToken ? "/dashboard" : "/login"}
              onClick={() => setMenuOpen(false)}
              className="font-mono text-[11px] uppercase text-stamp-navy font-bold tracking-wider pt-2 border-t border-stamp-navy/10"
            >
              {accessToken ? "DASHBOARD" : "SIGN IN"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
