import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /** CLRS textbook tan background for pseudocode blocks */
        "clrs-tan": "#f4f1ea",
        /** Darker accent for CLRS pseudocode line numbers */
        "clrs-line": "#c4b99a",
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
