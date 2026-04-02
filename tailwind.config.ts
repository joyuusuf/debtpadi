import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Clash Display'", "sans-serif"],
        body: ["'Satoshi'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#0D0D0D",
          50: "#F7F7F5",
          100: "#EDEDEA",
          200: "#D4D4CF",
          300: "#ABABAB",
          400: "#717171",
          500: "#4A4A4A",
          600: "#2E2E2E",
          700: "#1E1E1E",
          800: "#141414",
          900: "#0D0D0D",
        },
        jade: {
          DEFAULT: "#00C896",
          50: "#E6FFF8",
          100: "#B3FFEC",
          200: "#66FFD9",
          300: "#00FFC2",
          400: "#00E8AB",
          500: "#00C896",
          600: "#00A87D",
          700: "#008864",
          800: "#00684C",
          900: "#004833",
        },
        amber: {
          DEFAULT: "#F5A623",
          50: "#FFF8E7",
          100: "#FEEFC3",
          200: "#FDD887",
          300: "#FCC04B",
          400: "#FAA91F",
          500: "#F5A623",
          600: "#D4830A",
          700: "#A86308",
          800: "#7C4406",
          900: "#502A04",
        },
        coral: {
          DEFAULT: "#FF5A5A",
          50: "#FFF0F0",
          100: "#FFD6D6",
          200: "#FFADAD",
          300: "#FF8585",
          400: "#FF6B6B",
          500: "#FF5A5A",
          600: "#E03333",
          700: "#B52020",
          800: "#8A1212",
          900: "#600808",
        },
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-in": "slideIn 0.5s ease forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
