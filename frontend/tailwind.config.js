/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#fdfaf6",
          100: "#f9f2e9",
          200: "#f2e4d3",
          300: "#e8d1b9",
          400: "#d9b895",
          500: "#c99e73",
          600: "#b88556", // Main Primary
          700: "#9d6a43",
          800: "#845636",
          900: "#6f482f",
          950: "#402518",
        },
        // Nude lipstick-inspired color palette
        nude: {
          50: "#fef7f0", // Barely Nude - lightest
          100: "#fceee0", // Vanilla Nude
          200: "#f8dcc0", // Peach Nude
          300: "#f2c49f", // Caramel Nude
          400: "#e8a87a", // Honey Nude
          500: "#d18b5c", // Medium Nude
          600: "#b8704a", // Warm Nude
          700: "#9d5a3a", // Rich Nude
          800: "#7d452e", // Deep Nude
          900: "#5d3322", // Dark Nude
          950: "#3d1f15", // Espresso Nude
        },
        // MAC-inspired nude shades
        mac: {
          "velvet-teddy": "#c49b7b", // MAC Velvet Teddy
          "honey-love": "#d4a574", // MAC Honey Love
          mocha: "#8b5a3c", // MAC Mocha
          taupe: "#a67c68", // MAC Taupe
          whirl: "#8b6f47", // MAC Whirl
          persistence: "#9d6a43", // MAC Persistence
        },
        // Charlotte Tilbury-inspired nudes
        charlotte: {
          "pillow-talk": "#d4a574", // Charlotte Tilbury Pillow Talk
          "very-victoria": "#b8704a", // Charlotte Tilbury Very Victoria
          "penelope-pink": "#f2c49f", // Charlotte Tilbury Penelope Pink
          "bond-girl": "#8b5a3c", // Charlotte Tilbury Bond Girl
        },
        // Fenty Beauty-inspired nudes
        fenty: {
          spanked: "#c49b7b", // Fenty Spanked
          shawty: "#8b5a3c", // Fenty Shawty
          "freckle-fiesta": "#d4a574", // Fenty Freckle Fiesta
          unbutton: "#a67c68", // Fenty Unbutton
        },
        // Universal nude tones
        universal: {
          light: "#f5e1da", // Light nude for fair skin
          medium: "#d8b4a0", // Medium nude for olive skin
          deep: "#a67c68", // Deep nude for tan skin
          rich: "#8b5a3c", // Rich nude for dark skin
          warm: "#d4a574", // Warm undertone nude
          cool: "#c49b7b", // Cool undertone nude
        },
        gray: colors.stone,
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#895831", // sand-800
          "primary-focus": "#72482a", // sand-900
          "primary-content": "#ffffff",

          secondary: "#e8d1b9", // sand-300
          "secondary-focus": "#f2e4d3", // sand-200

          // Nude color accents
          accent: "#d4a574", // charlotte pillow-talk
          "accent-focus": "#b8704a", // charlotte very-victoria
          "accent-content": "#ffffff",

          neutral: "#8b5a3c", // mac mocha
          "neutral-focus": "#7d452e", // nude-800
          "neutral-content": "#ffffff",

          "base-100": "#ffffff",
          "base-200": "#f9fafb", // gray-50
          "base-300": "#f3f4f6", // gray-100
          "base-content": "#1f2937", // gray-800
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#d9b895", // sand-400
          "primary-focus": "#e8d1b9", // sand-300
          "primary-content": "#402518",

          secondary: "#895836", // sand-800
          "secondary-focus": "#72482f", // sand-900

          // Nude color accents for dark theme
          accent: "#a67c68", // universal deep
          "accent-focus": "#8b5a3c", // universal rich
          "accent-content": "#ffffff",

          neutral: "#5d3322", // nude-900
          "neutral-focus": "#3d1f15", // nude-950
          "neutral-content": "#f2e4d3",

          "base-100": "#0a0908", // Near-black
          "base-200": "#1c1917", // gray-900
          "base-300": "#292524", // gray-800
          "base-content": "#f2e4d3", // sand-200
        },
      },
    ],
  },
};
