/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Nude Foundation - Luxury Hospitality Palette
        nude: {
          50: '#fef7f0',    // nude-cream - primary backgrounds
          100: '#fceee0',   // nude-peach - subtle elements
          200: '#f8dcc0',   // nude-sand - borders, dividers
          300: '#f2c49f',   // nude-caramel - inactive states
          400: '#e8a87a',   // nude-honey - secondary actions
          500: '#d18b5c',   // nude-bronze - secondary buttons
          600: '#b8704a',   // nude-copper - PRIMARY ACTIONS
          700: '#9d5a3a',   // nude-mahogany - hover states
          800: '#7d452e',   // nude-expresso - text, headings
          900: '#5d3322',   // nude-mocha - strong text
          950: '#3d1f15',   // nude-charcoal - strongest text
        },
        // Luxury Accents - Premium Hospitality Elements
        luxury: {
          champagne: '#f7e7ce',  // premium features, VIP elements
          rose: '#e8b4a0',       // VIP elements, special offers
          bronze: '#cd853f',     // exclusive offers, gold tier
          charlotte: '#d4a574',  // CHARLOTTE PILLOW TALK - primary accent
        },
        // Spa & Wellness Colors
        spa: {
          pearl: '#f8f6f0',      // spa backgrounds
          copper: '#b8704a',     // spa accents
          silver: '#e8e8e8',     // spa borders
          stone: '#a8a8a8',      // spa text
        },
        // Hospitality Industry Colors
        hospitality: {
          terracotta: '#e2725b', // warm hospitality
          sage: '#87a96b',       // natural elements
          lavender: '#b4a7d6',   // calming accents
          sand: '#e6d2aa',       // beach/resort vibes
        },
        // Semantic Colors - Clear Meaning & High Contrast
        semantic: {
          success: '#10b981',    // confirmations, positive actions
          warning: '#f59e0b',    // warnings, attention needed
          error: '#ef4444',      // errors, destructive actions
          info: '#3b82f6',       // information, neutral actions
        },
        // Extended Color Palette for Complex UIs
        primary: {
          50: '#fef7f0',
          100: '#fceee0',
          200: '#f8dcc0',
          300: '#f2c49f',
          400: '#e8a87a',
          500: '#d18b5c',
          600: '#b8704a',
          700: '#9d5a3a',
          800: '#7d452e',
          900: '#5d3322',
          950: '#3d1f15',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        primary: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        signature: ['Dancing Script', 'cursive'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        'hero': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      animation: {
        'nude-wave': 'nudeWave 3s ease-in-out infinite',
        'warm-glow': 'warmGlow 2s ease-in-out infinite',
        'layered-nude': 'layeredNude 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth-appear': 'smoothAppear 0.6s ease-out',
        'hospitality-bounce': 'hospitalityBounce 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        nudeWave: {
          '0%, 100%': { 
            transform: 'translateY(0px)',
            backgroundPosition: '0% 50%',
          },
          '50%': { 
            transform: 'translateY(-4px)',
            backgroundPosition: '100% 50%',
          },
        },
        warmGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(184, 112, 74, 0.2)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(184, 112, 74, 0.4)',
          },
        },
        layeredNude: {
          '0%': { 
            transform: 'translateY(8px) scale(0.98)',
            opacity: '0',
          },
          '100%': { 
            transform: 'translateY(0) scale(1)',
            opacity: '1',
          },
        },
        smoothAppear: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95) translateY(10px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
        },
        hospitalityBounce: {
          '0%, 100%': { 
            transform: 'translateY(0)',
          },
          '50%': { 
            transform: 'translateY(-4px)',
          },
        },
        fadeIn: {
          '0%': { 
            opacity: '0',
          },
          '100%': { 
            opacity: '1',
          },
        },
        slideUp: {
          '0%': { 
            transform: 'translateY(20px)',
            opacity: '0',
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        slideDown: {
          '0%': { 
            transform: 'translateY(-20px)',
            opacity: '0',
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        scaleIn: {
          '0%': { 
            transform: 'scale(0.9)',
            opacity: '0',
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        pulseGentle: {
          '0%, 100%': { 
            opacity: '1',
          },
          '50%': { 
            opacity: '0.8',
          },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px)',
          },
          '50%': { 
            transform: 'translateY(-10px)',
          },
        },
        shimmer: {
          '0%': { 
            backgroundPosition: '-200% 0',
          },
          '100%': { 
            backgroundPosition: '200% 0',
          },
        },
      },
      backgroundImage: {
        'gradient-spa-serene': 'linear-gradient(135deg, #fef7f0 0%, #fceee0 50%, #f8dcc0 100%)',
        'gradient-luxury-gold': 'linear-gradient(135deg, #f7e7ce 0%, #e8b4a0 50%, #d4a574 100%)',
        'gradient-warm-hospitality': 'linear-gradient(135deg, #fceee0 0%, #f2c49f 50%, #b8704a 100%)',
        'gradient-nude-wave': 'linear-gradient(90deg, #fef7f0, #fceee0, #f2c49f, #fceee0, #fef7f0)',
      },
      boxShadow: {
        'nude-soft': '0 2px 8px rgba(184, 112, 74, 0.08), 0 1px 3px rgba(184, 112, 74, 0.12)',
        'nude-medium': '0 4px 16px rgba(184, 112, 74, 0.12), 0 2px 6px rgba(184, 112, 74, 0.08)',
        'nude-strong': '0 8px 32px rgba(184, 112, 74, 0.16), 0 4px 12px rgba(184, 112, 74, 0.12)',
        'nude-glow': '0 0 20px rgba(184, 112, 74, 0.3)',
        'luxury-soft': '0 4px 20px rgba(212, 165, 116, 0.15)',
        'luxury-medium': '0 8px 32px rgba(212, 165, 116, 0.2)',
        'luxury-strong': '0 16px 48px rgba(212, 165, 116, 0.25)',
        'spa-glow': '0 0 30px rgba(248, 246, 240, 0.8)',
        'hospitality-warm': '0 4px 24px rgba(226, 114, 91, 0.15)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        buffrhost: {
          "primary": "#b8704a",        // nude-copper - PRIMARY ACTIONS
          "secondary": "#d18b5c",      // nude-bronze - SECONDARY ACTIONS
          "accent": "#d4a574",         // charlotte - ACCENT ELEMENTS
          "neutral": "#7d452e",        // nude-expresso - TEXT
          "base-100": "#fef7f0",       // nude-cream - BACKGROUND
          "base-200": "#fceee0",       // nude-peach - SECONDARY BG
          "base-300": "#f8dcc0",       // nude-sand - TERTIARY BG
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
}