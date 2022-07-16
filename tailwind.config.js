/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Vazirmatn", "sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
