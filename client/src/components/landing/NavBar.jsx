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
  return (
    <header className="absolute top-0 left-0 right-0 z-30 border-b border-stamp-navy/12 bg-ticket/75 backdrop-blur">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="font-heading text-stamp-navy text-xl font-bold mono hover:opacity-80"
        >
          PREPPASS
        </Link>
        <nav className="hidden sm:flex items-center gap-5 md:gap-6 text-sm">
          {NAV_ITEMS.map((item) =>
            item.isAnchor ? (
              <a
                key={item.label}
                href={item.href}
                className="font-mono text-[11px] uppercase text-stamp-navy/50 hover:text-stamp-navy tracking-wider transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.to}
                className="font-mono text-[11px] uppercase text-stamp-navy/50 hover:text-stamp-navy tracking-wider transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>
        <Link
          to={accessToken ? "/dashboard" : "/login"}
          className="font-mono text-[11px] uppercase text-stamp-navy hover:underline tracking-wider"
        >
          {accessToken ? "DASHBOARD" : "SIGN IN"}
        </Link>
      </div>
    </header>
  );
}
