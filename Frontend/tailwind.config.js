/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-end Violet Palette
        premium: {
          black: "#050505",
          zinc: "#0f0f11",
          violet: "#7c3aed",
          glow: "rgba(124, 58, 237, 0.3)"
        }
      }
    },
  },
  plugins: [],
}