export default function AdmitCard() {
  return (
    <section id="features" className="py-16 bg-cream">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading text-stamp-navy text-center mb-10">
          Your exam admit card
        </h2>
        <div className="ticket-card relative p-6 sm:p-8">
          <div className="ticket-perf mb-6" />
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="font-mono">
              <div className="flex items-end gap-2 mb-4">
                <span className="text-[10px] text-stamp-navy/50">CANDIDATE</span>
                <span className="text-sm text-stamp-navy underline decoration-2 underline-offset-2 decoration-stamp-navy/20">
                  _ _ _ _ _ _ _
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[12px]">
                <div>
                  <span className="text-stamp-navy/50">SEAT</span>
                  <span className="text-stamp-navy ml-2">B-1</span>
                </div>
                <div>
                  <span className="text-stamp-navy/50">SESSION</span>
                  <span className="text-stamp-navy ml-2">07:30 / R2</span>
                </div>
                <div>
                  <span className="text-stamp-navy/50">TEST</span>
                  <span className="text-stamp-navy ml-2">SOFT-SKILLS</span>
                </div>
                <div className="text-right">
                  <span className="text-stamp-navy/50">SCORE</span>
                  <span className="text-stamp-navy ml-2">—</span>
                </div>
              </div>
              <div className="mt-5 h-11 bg-[repeating-linear-gradient(90,_#1a227e_0,_#1a227e_3px,_transparent_3px,_transparent_6px)]" />
              <div className="mt-1 text-[10px] text-stamp-navy/45">
                barcode · 004-005-012-008-301
              </div>
            </div>
            <div className="flex justify-end">
              <div className="w-28 h-28 border-2 border-stamp-navy/20 rounded bg-ticket grid grid-cols-3 gap-[2px] p-[3px]">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-stamp-navy/70 rounded-[1px]" />
                ))}
              </div>
            </div>
          </div>
          <div className="ticket-perf mt-6" />
          <div className="absolute top-3 right-3 ticket-stamp px-2 py-1 rounded text-stamp-navy font-mono text-[9px]">
            ADMIT • PREVIEW
          </div>
        </div>
      </div>
    </section>
  );
}
