/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
        fontFamily: {
            sans: ['var(--font-open-sans)'],
        },
    },
  },
  plugins: [],
};

module.exports = config;
