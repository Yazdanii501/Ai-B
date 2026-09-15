import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0A0A0C",
        "warm-black": "#14100C",
        gold: "#E6C888",
        amber: "#E8A94B",
        ink: "#F3F0E7",
        muted: "#8A8A94",
        smoke: "#3A3630",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        ui: ["Manrope", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        settle: "cubic-bezier(0.16, 1, 0.3, 1)",
        cinematic: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      boxShadow: {
        none: "none",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { opacity: "0.32", transform: "translate(-50%, -50%) scale(1)" },
          "50%": { opacity: "0.46", transform: "translate(-50%, -50%) scale(1.06)" },
        },
      },
      animation: {
        "glow-pulse": "glow-pulse 9s ease-in-out infinite",
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
} satisfies Config;
