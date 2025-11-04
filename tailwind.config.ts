import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        secondary: {
          DEFAULT: 'var(--secondary-bg)',
          hover: 'var(--secondary-hover)',
        },
        border: 'var(--border)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
        },
        accent: 'var(--accent)',
        card: 'var(--card-bg)',
        muted: {
          DEFAULT: 'var(--muted)',
          dark: 'var(--muted-dark)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'tighter-2': '-0.04em',
        'tighter-1': '-0.03em',
        'tight-1': '-0.02em',
      },
      spacing: {
        'section': '5rem',
        'section-lg': '8rem',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      boxShadow: {
        'premium': '0 1px 2px 0 rgba(255, 255, 255, 0.05)',
        'premium-lg': '0 4px 12px 0 rgba(255, 255, 255, 0.1)',
        'premium-xl': '0 8px 24px 0 rgba(255, 255, 255, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      screens: {
        'xs': '475px',
        'touch': { 'raw': '(hover: none)' },
      },
    },
  },
  plugins: [],
};

export default config;

