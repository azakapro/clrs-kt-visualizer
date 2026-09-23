import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /** CLRS textbook tan background for pseudocode blocks */
        "clrs-tan": "#f5f1e8",
        /** Darker accent for CLRS pseudocode line numbers */
        "clrs-line": "#c4b99a",
        /** Primary indigo accent */
        primary: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        /** Engaged / matched state */
        engaged: {
          50:  "#ecfdf5",
          100: "#d1fae5",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        /** Proposing / active state */
        proposing: {
          50:  "#fffbeb",
          100: "#fef3c7",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
      boxShadow: {
        "card":    "0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07)",
        "card-lg": "0 4px 16px 0 rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
        "glow-indigo": "0 0 0 3px rgb(99 102 241 / 0.25)",
        "glow-emerald": "0 0 0 3px rgb(16 185 129 / 0.25)",
        "glow-amber":   "0 0 0 3px rgb(245 158 11 / 0.20)",
      },
    },
  },
  plugins: [],
};

export default config;

