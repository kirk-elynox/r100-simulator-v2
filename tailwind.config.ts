import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand tokens
        'ink':              '#0A0A0F',
        'paper':            '#F6F4F0',
        'electric-violet':  '#8A00FF',
        'electric-violet-dark': '#B65BFF',
        'digital-phlox':    '#DD00FF',
        'heading-blue':     '#4F81BD',
        // Neutral surface scale
        surface: {
          '0':  '#FFFFFF',
          '1':  '#F8F8FA',
          '2':  '#F1F0F5',
          '3':  '#E4E3EC',
          '4':  '#C9C8D6',
        },
        // Dark surface scale
        dark: {
          '0':  '#09090B',
          '1':  '#111113',
          '2':  '#18181B',
          '3':  '#27272A',
          '4':  '#3F3F46',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'none' } },
      },
    },
  },
  plugins: [],
};
export default config;
