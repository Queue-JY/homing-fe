/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          mint1: '#57FF9A',
          mint2: '#43CE80',
          teal: '#00C6A9',
          lime: '#BDEA6A',
          mint3: '#6ADB86',
          cyan: '#4DD7C1',
          dark: '#03483E',
        },
      },
    },
  },
  plugins: [],
};