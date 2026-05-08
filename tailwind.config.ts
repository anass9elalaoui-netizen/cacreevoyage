import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#38A3A5',
          dark: '#0B132B',
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
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
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
