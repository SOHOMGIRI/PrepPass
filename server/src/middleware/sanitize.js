/**
 * Custom NoSQL injection sanitizer.
 *
 * Walks req.body, req.params, and req.query in place and removes any key
 * that starts with "$" or contains "." — the classic MongoDB operator
 * injection patterns. Critically, this mutates the *contents* of the
 * existing objects and never reassigns req.query / req.params / req.body
 * themselves, because in Express 5 those references are read-only.
 */

function clean(obj) {
  if (!obj || typeof obj !== "object" || obj instanceof Date) return;

  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (Array.isArray(obj[key])) {
      for (const item of obj[key]) {
        if (item && typeof item === "object" && !(item instanceof Date)) {
          clean(item);
        }
      }
    } else if (obj[key] && typeof obj[key] === "object" && !(obj[key] instanceof Date)) {
      clean(obj[key]);
    }
  }
}

export const sanitize = (req, res, next) => {
  try {
    clean(req.body);
    clean(req.params);
    clean(req.query);
  } catch {
    // If sanitization fails for any reason, continue rather than crash
  }
  next();
};
