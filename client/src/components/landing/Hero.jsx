import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import ParticleCanvas from "./ParticleCanvas.jsx";

const Hero3D = lazy(() => import("../Hero3D.jsx"));

const BTN =
  "inline-flex items-center justify-center rounded-lg font-heading font-semibold tracking-wider focus:outline-none focus:ring-2 focus:ring-stamp-navy/50 focus:ring-offset-2";
const BTN_PRIMARY = `${BTN} text-white bg-gold hover:bg-gold-dark px-8 py-3.5 shine-sweep`;
const BTN_OUTLINE = `${BTN} text-stamp-navy border-2 border-dashed border-stamp-navy/40 hover:bg-stamp-navy/10 px-8 py-3.5`;

// Characters used during the text-scramble reveal.
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&";

function useTextScramble(text, delay = 300) {
  const [display, setDisplay] = useState(text);
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useEffect(() => {
    if (prefersReduced.current) {
      setDisplay(text);
      return;
    }

    let frame = 0;
    const totalFrames = text.length * 3;
    let raf;

    const tick = () => {
      frame++;
      const progress = Math.min(frame / totalFrames, 1);
      const revealed = Math.floor(progress * text.length);

      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (i < revealed) {
          result += text[i];
        } else if (text[i] === " ") {
          result += " ";
        } else {
          result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(result);

      if (frame < totalFrames) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    const timer = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text, delay]);

  return display;
}

export default function Hero({ accessToken }) {
  const scrambled = useTextScramble("Your Placement, Rehearsed.", 400);

  return (
    <section className="relative pt-28 pb-20 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Base background layer */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(1200px 500px at 50% 30%, #ffffff 0%, #fbf8f0 100%)",
        }}
      />

      {/* Aurora gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-[5]">
        <div
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(212,167,44,0.4) 0%, transparent 70%)",
            animation: "aurora-drift-1 12s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full opacity-25 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(26,34,126,0.3) 0%, transparent 70%)",
            animation: "aurora-drift-2 15s ease-in-out infinite alternate",
          }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-20 blur-[90px]"
          style={{
            background:
              "radial-gradient(circle, rgba(212,167,44,0.25) 0%, transparent 70%)",
            animation: "aurora-drift-3 10s ease-in-out infinite alternate",
          }}
        />
      </div>

      {/* Spotlight glow following mouse */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-40"
        style={{
          background:
            "radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(212,167,44,0.12) 0%, transparent 100%)",
        }}
      />

      {/* Particle field */}
      <ParticleCanvas />

      <Suspense fallback={null}>
        <Hero3D />
      </Suspense>

      <div className="relative z-20 max-w-3xl mx-auto text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-heading text-4xl sm:text-5xl text-stamp-navy mb-5"
          aria-label="Your Placement, Rehearsed."
        >
          {scrambled}
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
          <Link
            to="/dashboard"
            className={BTN_PRIMARY}
            data-cursor="pointer"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className={`${BTN_PRIMARY} relative group`}
              data-cursor="pointer"
            >
              <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 border-2 border-stamp-navy/30 rounded-full bg-ticket" />
              <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 border-2 border-stamp-navy/30 rounded-full bg-ticket" />
              GET STARTED
            </Link>
            <Link to="/login" className={BTN_OUTLINE} data-cursor="pointer">
              LOG IN
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
