// tailwind.config.js
const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily:{
      'head': ['Montserrat', 'Noto Sans', 'Helvetica'],
      'display': ['Oswald'],
    },
    colors: {
      primary: '#041955',
      secondary: '#3450A1',
      third: '#EB06FF',
      fourth: '#2D9CDB',
      'text-color': '#96B3FE',
      ...colors,
      'transparent': 'transparent'
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
