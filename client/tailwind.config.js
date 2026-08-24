/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
        },
        cream: "var(--color-bg)", // legacy support, mapped to dark
        ticket: "var(--color-surface)", // legacy support, mapped to dark surface
        stamp: {
          navy: "var(--color-text-primary)", 
          maroon: "var(--stamp-maroon)",
        },
        gold: {
          light: "var(--color-accent-light)",
          DEFAULT: "var(--color-accent)",
          dark: "var(--color-accent-dark)",
        },
        ink: "var(--color-text-secondary)",
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