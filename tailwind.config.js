/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],

  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#f04e23",
          dark: "#d9411a",
        },
      },

      spacing: {
        bar: "25px",
        nav: "77px",
        header: "102px",
      },

      fontFamily: {
        sans: [
          "Outfit",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },

  plugins: [],
};