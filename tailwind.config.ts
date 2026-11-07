import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#060A13",
        navy: { DEFAULT: "#0A1730", 2: "#0F2247" },
        graphite: { DEFAULT: "#1A2230", 2: "#232C3D" },
        steel: "#8A97AD",
        brand: { DEFAULT: "#2E6BFF", soft: "#7BA2FF" },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { DEFAULT: "2px", sm: "2px", md: "4px", lg: "6px" },
    },
  },
  plugins: [],
};
export default config;
