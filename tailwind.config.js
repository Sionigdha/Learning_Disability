/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        dotMotion: {
          '0%': { top: '10%', left: '10%' },
          '25%': { top: '10%', left: '80%' },
          '50%': { top: '80%', left: '80%' },
          '75%': { top: '80%', left: '10%' },
          '100%': { top: '10%', left: '10%' },
        },
      },
      animation: {
        dotMotion: 'dotMotion 6s linear infinite',
      },
    },
  },
  plugins: [],
};
