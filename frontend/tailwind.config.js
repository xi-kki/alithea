/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Apple-inspired colors adapted for dark gaming
      colors: {
        apple: {
          // Text hierarchy (Apple standard)
          primary: '#1d1d1f',      // Midnight Graphite
          secondary: '#333333',    // Deep Gray
          tertiary: '#707070',     // Medium Gray
          muted: '#858585',        // Light Gray
          // Interactive (Apple Blue adapted)
          blue: '#0071e3',         // Interactive Blue
          'blue-hover': '#2997ff', // Sky Blue Highlight
          'blue-action': '#0066cc',// Action Blue
        },
        // Game-specific dark theme
        alithea: {
          primary: '#8B5CF6',      // Purple (main accent)
          secondary: '#EC4899',    // Pink (secondary)
          accent: '#06B6D4',       // Cyan (tertiary)
          success: '#10B981',      // Green (matches)
          warning: '#F59E0B',      // Amber (combos)
          danger: '#EF4444',       // Red (errors)
          dark: '#0F172A',         // Dark background
          darker: '#020617',       // Darker background
          card: '#1E293B',         // Card background
        }
      },
      // Apple typography scale
      fontFamily: {
        'sf-display': ['SF Pro Display', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'sf-text': ['SF Pro Text', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        // Apple type scale
        'caption': ['12px', { lineHeight: '1.5', letterSpacing: '-0.15px' }],
        'body-sm': ['14px', { lineHeight: '1.47', letterSpacing: '-0.18px' }],
        'subheading': ['18px', { lineHeight: '1.24', letterSpacing: '-0.22px' }],
        'callout': ['21px', { lineHeight: '1.19', letterSpacing: '-0.28px' }],
        'heading-sm': ['24px', { lineHeight: '1.33', letterSpacing: '-0.24px' }],
        'heading-lg': ['28px', { lineHeight: '1.14', letterSpacing: '0.29px' }],
        'display-xl': ['34px', { lineHeight: '1', letterSpacing: '-0.1px' }],
        'display-xxl': ['40px', { lineHeight: '1.1', letterSpacing: '0.44px' }],
        'display': ['56px', { lineHeight: '1.07', letterSpacing: '-0.28px' }],
      },
      // Apple spacing (4px base)
      spacing: {
        'apple-2': '2px',
        'apple-4': '4px',
        'apple-6': '6px',
        'apple-8': '8px',
        'apple-10': '10px',
        'apple-12': '12px',
        'apple-14': '14px',
        'apple-16': '16px',
        'apple-20': '20px',
        'apple-24': '24px',
        'apple-32': '32px',
        'apple-40': '40px',
        'apple-48': '48px',
        'apple-52': '52px',
      },
      // Apple border radius
      borderRadius: {
        'apple-sm': '8px',
        'apple-md': '11px',
        'apple-lg': '980px',      // Pill shape
        'apple-full': '999px',
      },
      // Apple shadows
      boxShadow: {
        'apple': 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0px',
        'apple-sm': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'apple-lg': '0 8px 32px rgba(0, 0, 0, 0.25)',
      },
      // Game animations
      animation: {
        'flip': 'flip 0.6s ease-in-out',
        'match': 'match 0.5s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        match: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.8)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
