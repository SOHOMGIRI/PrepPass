import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

/**
 * Create and start a singleton Lenis smooth-scroll instance synced to GSAP's
 * ticker.  Call once from App.jsx on mount — never on /test-mode.
 */
export function initLenis() {
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  // Keep ScrollTrigger in sync with Lenis's virtual scroll position.
  lenis.on("scroll", ScrollTrigger.update);

  // Drive Lenis from GSAP's global ticker (single rAF source).
  const tickerCb = (time) => {
    lenis.raf(time * 1000); // GSAP passes seconds, Lenis expects ms
  };
  gsap.ticker.add(tickerCb);
  gsap.ticker.lagSmoothing(0);

  // Store reference so we can remove on destroy.
  lenis.__gsapTickerCb = tickerCb;

  return lenis;
}

/**
 * Tear down the Lenis instance and remove all GSAP ticker hooks.
 */
export function destroyLenis() {
  if (!lenis) return;

  if (lenis.__gsapTickerCb) {
    gsap.ticker.remove(lenis.__gsapTickerCb);
  }
  lenis.destroy();
  lenis = null;
}

/**
 * Return the current Lenis instance (or null).
 */
export function getLenis() {
  return lenis;
}
