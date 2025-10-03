/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#1a1a2e',
        'brand-dark-secondary': '#161625',
        'brand-purple': '#9E2FD0',
        'brand-orange': '#F6B82E',
        'brand-teal': '#26D9A1',
        'brand-light': '#F3E5F5',
        'brand-navbar-light': '#8E44AD',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: [],
}
