/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#04040a',
          900: '#080810',
          800: '#0d0d1a',
          700: '#131320',
          600: '#1a1a2e',
          500: '#222238',
        },
        bitcoin: {
          DEFAULT: '#f7931a',
          dark: '#d4780f',
          light: '#ffaa44',
          glow: 'rgba(247,147,26,0.15)',
        },
        cyan: {
          sat: '#00d4ff',
          dark: '#0099cc',
          glow: 'rgba(0,212,255,0.12)',
        },
        gold: '#f5c842',
        emerald: { sat: '#00ff88' },
        crimson: { sat: '#ff3366' },
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        body: ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        'bitcoin-glow': 'radial-gradient(ellipse at center, rgba(247,147,26,0.15) 0%, transparent 70%)',
        'hero-mesh': 'radial-gradient(at 20% 50%, rgba(247,147,26,0.08) 0px, transparent 50%), radial-gradient(at 80% 20%, rgba(0,212,255,0.06) 0px, transparent 50%), radial-gradient(at 50% 80%, rgba(245,200,66,0.04) 0px, transparent 50%)',
      },
      boxShadow: {
        'bitcoin': '0 0 30px rgba(247,147,26,0.2), 0 0 60px rgba(247,147,26,0.08)',
        'cyan': '0 0 30px rgba(0,212,255,0.2), 0 0 60px rgba(0,212,255,0.08)',
        'gold': '0 0 20px rgba(245,200,66,0.3)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'card': '0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04)',
        'inset-top': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'score-fill': 'scoreFill 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scoreFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--score-width)' },
        },
      },
    },
  },
  plugins: [],
}
