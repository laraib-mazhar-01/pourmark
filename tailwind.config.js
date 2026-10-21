/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0B1A2A', soft: '#33465A', muted: '#6B7C8F' },
        mist: { DEFAULT: '#F5F8FB', deep: '#EAF1F7' },
        aqua: {
          50: '#EEF6FD',
          100: '#D9EBFA',
          200: '#B5D7F4',
          300: '#86BCEB',
          400: '#559CDF',
          500: '#2F7FD0',
          600: '#1F64AF',
          700: '#1B508C',
          800: '#1A4373',
          900: '#183960',
        },
        sand: '#F3EEE6',
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11,26,42,0.04), 0 8px 24px -8px rgba(11,26,42,0.10)',
        lift: '0 2px 4px rgba(11,26,42,0.04), 0 24px 48px -16px rgba(11,26,42,0.18)',
        glow: '0 10px 40px -10px rgba(47,127,208,0.45)',
      },
      borderRadius: { '4xl': '2rem' },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'label-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 5s ease-in-out infinite',
        'label-in': 'label-in 0.45s cubic-bezier(.2,.8,.2,1)',
        shimmer: 'shimmer 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
