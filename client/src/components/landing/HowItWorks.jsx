import { motion } from "framer-motion";

const STEPS = [
  {
    stamp: "INTERVIEW",
    title: "AI Mock Interviews",
    desc: "Role-matched questions that adapt in real time.",
  },
  {
    stamp: "SCORE",
    title: "Instant Readiness Scoring",
    desc: "A single admit-card-ready grade after every run.",
  },
  {
    stamp: "RESUME",
    title: "Resume-to-JD Matching",
    desc: "ATS-friendly feedback on how your line reads the role.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-ticket">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="font-heading text-stamp-navy text-center mb-3">
          How PrepPass works
        </h2>
        <p className="text-ink/55 text-center mb-12 max-w-xl mx-auto">
          Three passes — practice, score, refine — then rehearse with confidence.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: "easeOut" }}
              className="ticket-card h-full p-6"
            >
              <div className="ticket-stamp inline-block px-2 py-1 rounded text-stamp-navy font-mono text-[10px] mb-3">
                {s.stamp}
              </div>
              <h3 className="font-heading text-stamp-navy mb-2">{s.title}</h3>
              <p className="text-sm text-ink/60">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
