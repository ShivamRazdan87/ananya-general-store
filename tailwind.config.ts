import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#fff8ed",
          100: "#ffefd4",
          200: "#ffdba8",
          300: "#ffc070",
          400: "#ff9d38",
          500: "#ff7e12",
          600: "#f26208",
          700: "#c94a09",
          800: "#a03b10",
          900: "#823210",
        },
        leaf: {
          50: "#f1faf1",
          100: "#dcf2dd",
          200: "#bce4bf",
          300: "#8ccf92",
          400: "#57b160",
          500: "#349540",
          600: "#257731",
          700: "#1f5f2a",
          800: "#1c4c25",
          900: "#183f21",
        },
        haldi: {
          50: "#fffce8",
          100: "#fff6c2",
          200: "#ffec88",
          300: "#ffdb45",
          400: "#ffc613",
          500: "#f9ab06",
          600: "#dc8302",
          700: "#b65d06",
          800: "#93480c",
          900: "#7a3c0f",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "bounce-slow": "bounce 2s infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
