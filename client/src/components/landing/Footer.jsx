const FOOTER = ["About", "Careers", "Privacy", "Terms", "Contact"];

export default function Footer() {
  return (
    <footer className="py-10 border-t border-stamp-navy/10">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <div className="font-mono text-[11px] text-stamp-navy/50">
          © 2026 PREPPASS
        </div>
        <div className="flex flex-wrap gap-6">
          {FOOTER.map((f) => (
            <a
              key={f}
              href={`/${f.toLowerCase()}`}
              className="font-mono text-[11px] uppercase text-stamp-navy/50 hover:text-stamp-navy tracking-wider"
            >
              {f}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
