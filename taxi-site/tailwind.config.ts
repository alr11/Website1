import type { Config } from "tailwindcss";

/**
 * Palette rule for this site: near-black + ONE accent (gold).
 * Do not introduce a second accent hue — use gold tints/shades instead.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0b0b0c", // page black
          800: "#141416", // raised surface on dark
          700: "#1d1d20", // card border / hairline on dark
          600: "#2a2a2e",
        },
        gold: {
          50: "#fbf7e9",
          100: "#f5ecc9",
          200: "#ecdc9a",
          300: "#e0c766",
          400: "#d4b13c", // primary accent
          500: "#b8941f", // accessible on white (4.5:1+ for large text, used with care)
          600: "#7a5f11", // 5.7:1 on the bone background — safe for 12px text
          700: "#6b530f",
        },
        bone: {
          DEFAULT: "#faf8f4", // light page background
          200: "#efece5",
          300: "#ddd8cd",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 7vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 3.5rem)", { lineHeight: "1.06", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.75rem, 3.5vw, 2.5rem)", { lineHeight: "1.12", letterSpacing: "-0.01em" }],
      },
      maxWidth: {
        content: "72rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,11,12,0.04), 0 8px 24px -12px rgba(11,11,12,0.18)",
        lift: "0 2px 4px rgba(11,11,12,0.06), 0 18px 40px -16px rgba(11,11,12,0.28)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
