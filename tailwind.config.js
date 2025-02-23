/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mac-gray': '#E6E6E6',
        'mac-bg': '#666666',
        'mac-border': '#000000',
        'mac-text': '#000000',
      },
      fontFamily: {
        'chicago': ['Chicago', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 