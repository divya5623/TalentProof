import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A1628",
          soft: "#1C2E45",
          muted: "#5A6B7D",
        },
        paper: {
          DEFAULT: "#F4F7FA",
          card: "#FFFFFF",
          line: "#D5DEE8",
        },
        seal: {
          DEFAULT: "#176B63",
          deep: "#0E4F49",
          soft: "#D8EFEA",
        },
        signal: {
          DEFAULT: "#B45309",
          soft: "#FEF3C7",
        },
      },
      fontFamily: {
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        body: ["var(--font-plex)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 rgba(10,22,40,0.04), 0 12px 32px rgba(10,22,40,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
