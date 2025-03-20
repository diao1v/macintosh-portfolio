/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'mac-gray': '#E6E6E6',
        'mac-bg': '#666666',
        'mac-border': '#000000',
        'mac-text': '#000000',
      },
      fontFamily: {
        chicago: ['Chicago', 'sans-serif'],
        monaco: ['Monaco', 'sans-serif'],
        torrance: ['Torrance', 'sans-serif'],
        geneva: ['Geneva', 'sans-serif'],
      },
      keyframes: {
        'spin-y': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
      },
      animation: {
        'spin-y': 'spin-y 5s cubic-bezier(.8,0,.2,1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
  ],
};
