import { Link } from "react-router-dom";

const NAV = ["Features", "How it works", "Pricing", "Contact"];

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
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          {NAV.map((n) => (
            <a
              key={n}
              href={`#${n.toLowerCase()}`}
              className="font-mono text-[11px] uppercase text-stamp-navy/50 hover:text-stamp-navy tracking-wider"
            >
              {n}
            </a>
          ))}
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
