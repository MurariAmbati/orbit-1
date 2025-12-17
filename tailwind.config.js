/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        slate: {
          950: '#020617',
        },
      },
      boxShadow: {
        'card': '0 18px 45px rgba(15, 23, 42, 0.8)',
        'planet': '0 0 24px rgba(129, 140, 248, 0.8)',
        'planet-urgent': '0 0 24px rgba(244, 63, 94, 0.8)',
      },
    },
  },
  plugins: [],
}
