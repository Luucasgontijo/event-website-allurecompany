/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'allure-brown': '#6C3F34',
        'allure-light': '#EADFD5',
        'allure-secondary': '#8B5A4A',
        'allure-accent': '#A67C73',
      },
      fontFamily: {
        'spartan': ['League Spartan', 'sans-serif'],
      },
    },
  },
  plugins: [],
}