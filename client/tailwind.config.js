export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2d6a4f",
        "primary-light": "#40916c",
        "primary-lighter": "#52b788",
        "primary-lightest": "#b7e4c7",
        "primary-faint": "#d8f3dc",
        accent: "#ff6b35",
        "accent-hover": "#e55a2b",
        dark: "#1b2a1f",
        "text-main": "#2d3436",
        "text-light": "#636e72",
        cream: "#f8faf5",
        "green-tint": "#edf7f0",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}