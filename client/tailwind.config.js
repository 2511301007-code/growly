/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Primary Palette (Deep Navy Architecture) */
        primary: '#000000',
        'on-primary': '#ffffff',
        'primary-container': '#131b2e',
        'on-primary-container': '#7c839b',
        'primary-fixed': '#dae2fd',
        'primary-fixed-dim': '#bec6e0',
        'on-primary-fixed': '#131b2e',
        'on-primary-fixed-variant': '#3f465c',
        'inverse-primary': '#bec6e0',

        /* Secondary (Golden Amber) */
        secondary: '#855300',
        'on-secondary': '#ffffff',
        'secondary-container': '#fea619',
        'on-secondary-container': '#684000',
        'secondary-fixed': '#ffddb8',
        'secondary-fixed-dim': '#ffb95f',
        'on-secondary-fixed': '#2a1700',
        'on-secondary-fixed-variant': '#653e00',

        /* Tertiary (Cognitive Teal) */
        tertiary: '#000000',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#00201d',
        'on-tertiary-container': '#0c9488',
        'tertiary-fixed': '#89f5e7',
        'tertiary-fixed-dim': '#6bd8cb',
        'on-tertiary-fixed': '#00201d',
        'on-tertiary-fixed-variant': '#005049',

        /* Error */
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        /* Surface & Canvas */
        surface: '#f7f9fb',
        'surface-dim': '#d8dadc',
        'surface-bright': '#f7f9fb',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f2f4f6',
        'surface-container': '#eceef0',
        'surface-container-high': '#e6e8ea',
        'surface-container-highest': '#e0e3e5',
        'on-surface': '#191c1e',
        'on-surface-variant': '#45464d',
        'surface-variant': '#e0e3e5',
        'surface-tint': '#565e74',
        'inverse-surface': '#2d3133',
        'inverse-on-surface': '#eff1f3',
        background: '#f7f9fb',
        'on-background': '#191c1e',

        /* Outline */
        outline: '#76777d',
        'outline-variant': '#c6c6cd',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.25rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      spacing: {
        gutter: '1.5rem',
        'gutter-mobile': '1rem',
        margin: '2rem',
        'margin-mobile': '1rem',
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2rem',
      },
      fontFamily: {
        jakarta: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'monospace'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'display-lg-mobile': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'headline-xl': ['36px', { lineHeight: '44px', fontWeight: '700' }],
        'headline-xl-mobile': ['26px', { lineHeight: '34px', fontWeight: '600' }],
        'headline-lg': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'headline-md': ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-sm': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '26px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '16px', fontWeight: '600' }],
        'label-sm': ['11px', { lineHeight: '14px', fontWeight: '500' }],
        'code-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      boxShadow: {
        'card-1': '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)',
        'card-2': '0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.03)',
        'card-3': '0 12px 32px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'ai-glow': '0 0 0 1px rgba(245, 158, 11, 0.25), 0 8px 24px -4px rgba(245, 158, 11, 0.08)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'fade-in': 'fade-in 0.4s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
