import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero3D = lazy(() => import("../Hero3D.jsx"));

const BTN =
  "inline-flex items-center justify-center rounded-lg font-heading font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2";
const BTN_PRIMARY = `${BTN} text-white bg-gold hover:bg-gold-dark px-8 py-3.5`;
const BTN_OUTLINE = `${BTN} text-stamp-navy border-2 border-dashed border-stamp-navy/40 hover:bg-stamp-navy/10 px-8 py-3.5`;

export default function Hero({ accessToken }) {
  return (
    <section className="relative pt-28 pb-20 min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 500px at 50% 30%, #ffffff 0%, #fbf8f0 100%)",
        }}
      />
      <Suspense fallback={null}>
        <Hero3D />
      </Suspense>
      <div className="relative z-20 max-w-3xl mx-auto text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-heading text-4xl sm:text-5xl text-stamp-navy mb-5"
        >
          Your Placement, Rehearsed.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-ink/60 text-lg mb-8 max-w-xl mx-auto"
        >
          Mock interviews, readiness grades, and resume feedback — wrapped in an
          exam admit card you can rehearse, refine, and walk in with.
        </motion.p>

        {accessToken ? (
          <Link to="/dashboard" className={BTN_PRIMARY}>
            Go to Dashboard
          </Link>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className={`${BTN_PRIMARY} relative group`}>
              <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 border-2 border-stamp-navy/30 rounded-full bg-ticket" />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 border-2 border-stamp-navy/30 rounded-full bg-ticket" />
              GET STARTED
            </Link>
            <Link to="/login" className={BTN_OUTLINE}>
              LOG IN
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
