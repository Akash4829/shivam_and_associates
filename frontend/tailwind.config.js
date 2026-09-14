/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0B1628',
        secondary: '#14233A',
        accent: '#C9A227',
        'accent-light': '#E2C766',
        surface: '#F7F5F0',
        card: '#FFFFFF',
        border: '#E5E1D8',
        muted: '#5B6472',
        success: '#2F6B4F',
        warning: '#C9A227',
        charcoal: '#0B1628',
        navy: '#0B1628',
        'navy-blue': '#14233A',
        gold: '#C9A227',
        beige: '#E5E1D8',
        'off-white': '#F7F5F0',
        ink: '#111827',
        midnight: '#14233A',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
        hindi: ['"Noto Sans Devanagari"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.375rem, 4.2vw, 4.5rem)', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 3.4vw, 3.25rem)', { lineHeight: '1.18', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.5rem, 2.4vw, 2.125rem)', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      maxWidth: {
        prose: '65ch',
        content: '80rem',
      },
      borderRadius: {
        '4xl': '1.25rem',
      },
      boxShadow: {
        'depth-sm': '0 1px 2px rgba(11, 22, 40, 0.04), 0 8px 24px rgba(11, 22, 40, 0.04)',
        'depth-md': '0 8px 28px rgba(11, 22, 40, 0.08)',
        'depth-dark': '0 16px 40px rgba(0,0,0,0.28)',
        glass: '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 8px 24px rgba(0,0,0,0.12)',
        'glass-lg': '0 8px 32px rgba(0,0,0,0.18)',
        'glow-accent': 'none',
        'glow-accent-hover': 'none',
        'glow-gold': 'none',
        'glow-gold-soft': 'none',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-luxury': 'linear-gradient(180deg, rgba(11,22,40,0.55) 0%, rgba(11,22,40,0.72) 100%)',
        'gradient-accent': 'none',
        'surface-gradient': 'linear-gradient(180deg, #0B1628 0%, #14233A 100%)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 48s linear infinite',
      },
    },
  },
  plugins: [],
};
