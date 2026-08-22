import { motion } from "framer-motion";

/**
 * Wraps a page in a simple fade + slide transition.
 * Used by App.jsx for every route EXCEPT /test-mode.
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
