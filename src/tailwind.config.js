/** @type {import('tailwindcss').Config} */
export default {
  // Content paths for Tailwind to scan
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
  ],

  // Dark mode configuration
  darkMode: 'class',

  // Theme customization
  theme: {
    extend: {
      // Font Family
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      // Colors
      colors: {
        // Primary colors
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        
        // Accent colors
        accent: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },

        // Conferia brand colors
        conferia: {
          purple: '#7c3aed',
          pink: '#ec4899',
          dark: '#0a0a0f',
          darker: '#13111c',
          light: '#fafbff',
          glass: 'rgba(19, 17, 28, 0.6)',
        },

        // Semantic colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },

      // Spacing
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '54': '13.5rem',
        '58': '14.5rem',
        '62': '15.5rem',
        '66': '16.5rem',
        '70': '17.5rem',
        '74': '18.5rem',
        '78': '19.5rem',
        '82': '20.5rem',
        '86': '21.5rem',
        '90': '22.5rem',
        '94': '23.5rem',
        '98': '24.5rem',
      },

      // Border Radius
      borderRadius: {
        'xs': '0.25rem',
        'sm': '0.375rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'full': '9999px',
      },

      // Box Shadow
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glass': '0 8px 32px rgba(124, 58, 237, 0.08)',
        'glass-hover': '0 12px 40px rgba(124, 58, 237, 0.12)',
        'glow-purple': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
        'none': 'none',
      },

      // Animation
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'spin-slower': 'spin 5s linear infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'scale-out': 'scaleOut 0.3s ease-out',
        'card-enter': 'cardEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // Keyframes
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.9)' },
        },
        cardEnter: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },

      // Transition Timing
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      // Transition Duration
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
        '1500': '1500ms',
        '2000': '2000ms',
        '2500': '2500ms',
        '3000': '3000ms',
      },

      // Z-Index
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'auto': 'auto',
      },

      // Opacity
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '45': '0.45',
        '55': '0.55',
        '65': '0.65',
        '85': '0.85',
      },

      // Max Width
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        '10xl': '104rem',
      },

      // Min Height
      minHeight: {
        'screen-dvh': '100dvh',
        'screen-svh': '100svh',
        'screen-lvh': '100lvh',
      },

      // Backdrop Blur
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
      },

      // Background Image
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-glass': 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1))',
      },

      // Screens (Breakpoints)
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        'tall': { 'raw': '(min-height: 800px)' },
      },

      // Typography
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'var(--text-primary)',
            a: {
              color: 'var(--accent-primary)',
              '&:hover': {
                color: 'var(--accent-secondary)',
              },
            },
          },
        },
      },
    },
  },

  // Plugins
  plugins: [
    // Tailwind Forms
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),

    // Tailwind Typography
    require('@tailwindcss/typography'),

    // Tailwind Aspect Ratio
    require('@tailwindcss/aspect-ratio'),

    // Tailwind Container Queries
    require('@tailwindcss/container-queries'),

    // Custom plugin for Conferia components
    function ({ addComponents, theme }) {
      addComponents({
        '.btn-primary': {
          backgroundColor: theme('colors.conferia.purple'),
          color: 'white',
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.xl'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.glow-purple'),
          },
        },
        '.btn-secondary': {
          backgroundColor: 'transparent',
          color: theme('colors.conferia.purple'),
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          borderRadius: theme('borderRadius.xl'),
          border: `1px solid ${theme('colors.conferia.purple')}`,
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
          },
        },
        '.card': {
          backgroundColor: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          borderRadius: theme('borderRadius.2xl'),
          border: '1px solid var(--glass-border)',
          padding: theme('spacing.6'),
          boxShadow: theme('boxShadow.glass'),
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme('boxShadow.glass-hover'),
          },
        },
      });
    },

    // Custom variant for glass morphism
    function ({ addVariant }) {
      addVariant('glass', '&.glass-morphism');
      addVariant('light', '.light &');
      addVariant('dark', '.dark &');
    },
  ],
};