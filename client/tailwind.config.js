/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Exam admit-card / boarding-pass identity */
        cream: "#fdfbf7", // warm cream page background
        ticket: "#fbf8f0", // ticket-card fill
        stamp: {
          navy: "#1a227e", // deep "official stamp" color
          maroon: "#7a0c0c", // alternate stamp color
        },
        gold: {
          DEFAULT: "#d4a72c", // muted gold/amber for scores & CTAs
          dark: "#b79103",
        },
        ink: "#2c2a33", // primary text
      },
      fontFamily: {
        heading: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        body: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      boxShadow: {
        ticket: "0 10px 30px 0 rgba(26, 34, 126, 0.07)",
      },
    },
  },
  plugins: [],
};