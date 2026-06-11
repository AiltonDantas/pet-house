/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0',
          300: '#86efac', 400: '#4ade80', 500: '#3db85e',
          600: '#2e964e', 700: '#166534', 800: '#14532d', 900: '#052e16',
        },
      },
      fontFamily: { sans: ['Inter','sans-serif'] },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,.08)',
        modal: '0 20px 60px rgba(0,0,0,.18)',
      },
      borderRadius: { '2xl':'1rem','3xl':'1.5rem' },
      animation: {
        'fade-in':'fadeIn .2s ease',
        'slide-up':'slideUp .25s ease',
      }
    },
  },
  plugins: [],
}
