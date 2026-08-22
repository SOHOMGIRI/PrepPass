import { useState } from "react";
import { Link } from "react-router-dom";

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

  return (
    <header className="absolute top-0 left-0 right-0 z-30 glass-nav">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="font-heading text-stamp-navy text-xl font-bold mono hover:opacity-80"
        >
          PREPPASS
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-5 md:gap-6 text-sm">
          {NAV_ITEMS.map((item) =>
            item.isAnchor ? (
              <a
                key={item.label}
                href={item.href}
                className="animated-underline font-mono text-[11px] uppercase text-stamp-navy/50 hover:text-stamp-navy tracking-wider transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="animated-underline font-mono text-[11px] uppercase text-stamp-navy/50 hover:text-stamp-navy tracking-wider transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
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
        <div className="sm:hidden border-t border-stamp-navy/10 bg-ticket/95 backdrop-blur">
          <nav className="flex flex-col px-6 py-4 space-y-4">
            {NAV_ITEMS.map((item) =>
              item.isAnchor ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-mono text-[11px] uppercase text-stamp-navy/70 hover:text-stamp-navy tracking-wider"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="font-mono text-[11px] uppercase text-stamp-navy/70 hover:text-stamp-navy tracking-wider"
                >
                  {item.label}
                </Link>
              )
            )}
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
