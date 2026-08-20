import { motion } from "framer-motion";

const FEATURES = [
  {
    stamp: "INTERVIEWS",
    title: "AI Mock Interviews",
    desc: "Adaptive technical & HR questions, instant scoring, and optional voice-answer mode with camera preview.",
    icon: "🎙️",
  },
  {
    stamp: "ATS AUDIT",
    title: "Resume ATS & Job-Match",
    desc: "Instant compliance audit, missing section warnings, and job description match feedback.",
    icon: "📄",
  },
  {
    stamp: "BUILDER",
    title: "AI Resume Builder",
    desc: "Multi-step builder with AI bullet-point enhancement and recruiter-ready PDF export.",
    icon: "✨",
  },
  {
    stamp: "TEST MODE",
    title: "Proctored Test Mode",
    desc: "Timed 10-minute MCQ assessments with proctoring violation tracking and trust scoring.",
    icon: "⏱️",
  },
  {
    stamp: "APTITUDE",
    title: "Aptitude Practice",
    desc: "Untimed, focused drills for Quantitative Aptitude, Logical Reasoning, and Verbal Ability.",
    icon: "🧩",
  },
  {
    stamp: "COMPANY PREP",
    title: "Company-Specific Tracks",
    desc: "Targeted recruitment patterns and syllabus tracks for TCS, Amazon, Google, Infosys & more.",
    icon: "🏢",
  },
  {
    stamp: "GD PRACTICE",
    title: "Group Discussion Practice",
    desc: "Rehearse GD rounds with AI counter-arguments, rebuttal feedback, and persuasiveness scoring.",
    icon: "💬",
  },
  {
    stamp: "REVISION DECK",
    title: "Weak-Area Revision Deck",
    desc: "Interactive 3D flashcards automatically generated from missed test MCQs and low interview scores.",
    icon: "🃏",
  },
  {
    stamp: "ANALYTICS",
    title: "Readiness & Peer Analytics",
    desc: "Multi-series performance trend charts and anonymized peer percentile rankings per subject.",
    icon: "📊",
  },
];

export default function AdmitCard() {
  return (
    <section id="features" className="py-16 bg-cream">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="ticket-stamp inline-block rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp-navy mb-3">
            ALL-IN-ONE PLACEMENT TOOLKIT
          </div>
          <h2 className="font-heading text-3xl text-stamp-navy sm:text-4xl">
            Everything you need to crack placements.
          </h2>
          <p className="mt-2 text-sm text-ink/60 max-w-xl mx-auto">
            From ATS resume auditing to proctored MCQs and voice mock interviews — complete prep in one passport.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.45, ease: "easeOut" }}
              className="ticket-card p-6 flex flex-col justify-between transition hover:border-stamp-navy/40"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{f.icon}</span>
                  <div className="ticket-stamp px-2 py-0.5 rounded text-stamp-navy font-mono text-[9px] uppercase">
                    {f.stamp}
                  </div>
                </div>
                <h3 className="font-heading text-lg text-stamp-navy mb-2">
                  {f.title}
                </h3>
                <p className="text-xs text-ink/70 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
