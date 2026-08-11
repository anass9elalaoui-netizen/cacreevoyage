import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1C8CC9', /* Ocean Blue */
          cyan: '#49C0EA',
          dark: '#0B132B', /* Dark Navy */
          deeper: '#050814',
          gold: '#C9A84C',
          silver: '#A0ABC0',
          white: '#FFFFFF',
          glass: 'rgba(255, 255, 255, 0.05)',
          'glass-md': 'rgba(255, 255, 255, 0.08)',
          'glass-dark': 'rgba(11, 19, 43, 0.85)',
        },
        cloud: '#F4F7FB',
        glass: {
          light: 'rgba(255, 255, 255, 0.15)',
          dark: 'rgba(11, 19, 43, 0.4)',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}

export default config
