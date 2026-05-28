/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0B0F19',
        secondary: '#101828',
        accent: '#C9A227',
        surface: '#F5F3EF',
        card: 'rgba(255,255,255,0.04)',
        border: 'rgba(255,255,255,0.08)',
        muted: '#94A3B8',
        success: '#10B981',
        warning: '#F59E0B',
        charcoal: '#0B0F19',
        navy: '#101828',
        'navy-blue': '#0F1B3D',
        gold: '#C9A227',
        beige: '#E8E4DC',
        'off-white': '#F8F6F2',
        ink: '#0B0F19',
        midnight: '#101828',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Manrope', 'Inter', 'sans-serif'],
        heading: ['Sora', 'Plus Jakarta Sans', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem,6vw,4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2rem,4.5vw,3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.5rem,3vw,2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
      maxWidth: {
        prose: '65ch',
        content: '72rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        glass: '0 1px 0 0 rgba(255,255,255,0.08) inset, 0 8px 32px rgba(0,0,0,0.12)',
        'glass-lg': '0 1px 0 0 rgba(255,255,255,0.06) inset, 0 24px 64px rgba(0,0,0,0.2)',
        'depth-sm': '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',
        'depth-md': '0 4px 24px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.04)',
        'depth-dark': '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        'glow-accent': '0 0 32px rgba(201, 162, 39, 0.18)',
        'glow-accent-hover': '0 0 48px rgba(201, 162, 39, 0.28)',
        'glow-gold': '0 0 36px rgba(212, 175, 55, 0.22), inset 0 1px 0 rgba(255,255,255,0.18)',
        'glow-gold-soft': '0 0 18px rgba(212, 175, 55, 0.18), 0 6px 18px rgba(0,0,0,0.18)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-luxury':
          'linear-gradient(165deg, rgba(11,15,25,0.92) 0%, rgba(16,24,40,0.88) 45%, rgba(11,15,25,0.95) 100%)',
        'gradient-accent': 'linear-gradient(135deg, #C9A227 0%, #E8D48A 50%, #C9A227 100%)',
        'surface-gradient': 'linear-gradient(180deg, #0B0F19 0%, #101828 100%)',
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 20s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
};
