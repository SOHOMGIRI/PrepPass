import { motion } from "framer-motion";

/**
 * Wraps a page in a simple fade + slide transition.
 * Used by App.jsx for every route EXCEPT /test-mode.
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
