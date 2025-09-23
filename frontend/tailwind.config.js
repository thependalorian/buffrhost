/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#fdfaf6',
          100: '#f9f2e9',
          200: '#f2e4d3',
          300: '#e8d1b9',
          400: '#d9b895',
          500: '#c99e73', 
          600: '#b88556', // Main Primary
          700: '#9d6a43',
          800: '#845636',
          900: '#6f482f',
          950: '#402518',
        },
        gray: colors.stone,
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#895831', // sand-800
          'primary-focus': '#72482a', // sand-900
          'primary-content': '#ffffff',
          
          secondary: '#e8d1b9', // sand-300
          'secondary-focus': '#f2e4d3', // sand-200

          'base-100': '#ffffff',
          'base-200': '#f9fafb', // gray-50
          'base-300': '#f3f4f6', // gray-100
          'base-content': '#1f2937', // gray-800
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#d9b895', // sand-400
          'primary-focus': '#e8d1b9', // sand-300
          'primary-content': '#402518',

          secondary: '#895836', // sand-800
          'secondary-focus': '#72482f', // sand-900

          'base-100': '#0a0908', // Near-black
          'base-200': '#1c1917', // gray-900
          'base-300': '#292524', // gray-800
          'base-content': '#f2e4d3', // sand-200
        },
      },
    ],
  },
};
