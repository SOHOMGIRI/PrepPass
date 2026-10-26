/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        surfaceMuted: "var(--color-surface-muted)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
        cream: "var(--color-bg)",
        ticket: "var(--color-surface)",
        stamp: {
          navy: "var(--stamp-navy)", 
          maroon: "var(--stamp-maroon)",
          emerald: "var(--stamp-emerald)",
        },
        gold: {
          light: "var(--color-accent-light)",
          DEFAULT: "var(--color-accent)",
          dark: "var(--color-accent-dark)",
        },
        navy: {
          950: "#060A17",
          900: "#0A1128",
          850: "#0E1838",
          800: "#13214A",
          700: "#1E316B",
          600: "#2B438C",
          500: "#3D5CAE",
          100: "#EAF0FA",
          50: "#F4F7FC",
        },
        aurum: {
          light: "#F3E3B6",
          DEFAULT: "#C5A059",
          dark: "#9E7B35",
        },
        alabaster: "#FDFBF7",
        parchment: "#F6F3EB",
        ink: "var(--color-text-primary)",
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "Cinzel", "Space Grotesk", "sans-serif"],
        serif: ["Cinzel", "Playfair Display", "serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
        body: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        ticket: "0 10px 30px 0 rgba(10, 17, 40, 0.05)",
        imperial: "0 20px 45px -10px rgba(10, 17, 40, 0.08), 0 8px 16px -4px rgba(10, 17, 40, 0.03)",
        card: "0 4px 14px rgba(10, 17, 40, 0.04), 0 0 0 1px rgba(10, 17, 40, 0.06)",
        aurum: "0 10px 25px rgba(197, 160, 89, 0.22)",
      },
    },
  },
  plugins: [],
};
