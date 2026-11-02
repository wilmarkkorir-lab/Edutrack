/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#12263A", soft: "#4A5B6C", faint: "#8493A2" },
        paper: "#F3F5F8",
        brand: { DEFAULT: "#0E7C86", dark: "#0A5F67", soft: "#E3F2F3" },
        signal: "#C2410C",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        sans: ['"Public Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
