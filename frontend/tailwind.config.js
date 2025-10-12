/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Buffr Host Nude Color Palette
        nude: {
          50: '#fef7f0',   // nude-cream (Primary backgrounds)
          100: '#fceee0',  // nude-peach (Subtle elements)
          200: '#f8dcc0',  // nude-sand (Borders, dividers)
          300: '#f2c49f',  // nude-caramel (Inactive states)
          400: '#e8a87a',  // nude-honey (Secondary actions)
          500: '#d18b5c',  // nude-bronze (Secondary buttons)
          600: '#b8704a',  // nude-copper (PRIMARY ACTIONS)
          700: '#9d5a3a',  // nude-mahogany (Hover states)
          800: '#7d452e',  // nude-expresso (Text, headings)
          900: '#5d3322',  // nude-mocha (Strong text)
          950: '#3d1f15',  // nude-charcoal (Strongest text)
        },
        // Charlotte Pillow Talk Collection
        luxury: {
          charlotte: '#d4a574',  // Primary accent (VIP elements)
          champagne: '#f7e7ce',  // Premium features
          rose: '#e8b4a0',       // Special offers
          bronze: '#cd853f',     // Exclusive elements
        },
        // Semantic Colors
        semantic: {
          success: '#10b981',    // Confirmations, positive actions
          warning: '#f59e0b',    // Warnings, attention needed
          error: '#ef4444',      // Errors, destructive actions
          info: '#3b82f6',       // Information, neutral actions
        },
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'signature': ['Dancing Script', 'cursive'],
      },
      boxShadow: {
        'nude-soft': '0 4px 6px -1px rgba(184, 112, 74, 0.1), 0 2px 4px -1px rgba(184, 112, 74, 0.06)',
        'nude-medium': '0 10px 15px -3px rgba(184, 112, 74, 0.1), 0 4px 6px -2px rgba(184, 112, 74, 0.05)',
        'nude-strong': '0 20px 25px -5px rgba(184, 112, 74, 0.1), 0 10px 10px -5px rgba(184, 112, 74, 0.04)',
        'luxury-soft': '0 4px 6px -1px rgba(212, 165, 116, 0.1), 0 2px 4px -1px rgba(212, 165, 116, 0.06)',
        'luxury-medium': '0 10px 15px -3px rgba(212, 165, 116, 0.1), 0 4px 6px -2px rgba(212, 165, 116, 0.05)',
        'luxury-strong': '0 20px 25px -5px rgba(212, 165, 116, 0.1), 0 10px 10px -5px rgba(212, 165, 116, 0.04)',
      },
      animation: {
        'warm-glow': 'warmGlow 2s ease-in-out infinite',
        'nude-wave': 'nudeWave 3s ease-in-out infinite',
        'smooth-appear': 'smoothAppear 0.6s ease-out',
        'hover-lift': 'hoverLift 0.3s ease-out',
      },
      keyframes: {
        warmGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(184, 112, 74, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(184, 112, 74, 0.3)' },
        },
        nudeWave: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-2px)' },
        },
        smoothAppear: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        hoverLift: {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-2px)' },
        },
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        buffr: {
          "primary": "#b8704a",      // nude-600
          "secondary": "#d18b5c",    // nude-500
          "accent": "#d4a574",       // luxury-charlotte
          "neutral": "#7d452e",      // nude-800
          "base-100": "#fef7f0",     // nude-50
          "base-200": "#fceee0",     // nude-100
          "base-300": "#f8dcc0",     // nude-200
          "info": "#3b82f6",         // semantic-info
          "success": "#10b981",      // semantic-success
          "warning": "#f59e0b",      // semantic-warning
          "error": "#ef4444",        // semantic-error
        },
      },
    ],
  },
}