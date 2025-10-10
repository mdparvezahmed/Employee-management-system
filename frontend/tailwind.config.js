/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'bitcount': ['Bitcount Single Ink', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
