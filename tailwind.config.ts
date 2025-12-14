import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          600: '#059669',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          500: '#6B7280',
          700: '#374151',
          900: '#111827',
        },
        // Legacy color mappings for compatibility
        sacredGold: '#F59E0B',
        deepEarth: '#374151',
        spiritualBlue: '#8B5CF6',
        parchment: '#F9FAFB',
        inkBlack: '#111827',
        stoneGray: '#6B7280',
        livingGreen: '#10B981',
        gentleAmber: '#F59E0B',
        softBurgundy: '#9B5B5B',
      },
      fontFamily: {
        heading: ['Crimson Pro', 'serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        scripture: ['Lora', 'serif'],
      },
      boxShadow: {
        card: '0 4px 20px rgba(90, 74, 59, 0.08)',
        cardHover: '0 6px 24px rgba(90, 74, 59, 0.12)',
        goldGlow: '0 4px 20px rgba(196, 148, 29, 0.2)',
        glass: '0 8px 32px 0 rgba(90, 74, 59, 0.1)',
        'glass-gold': '0 8px 32px 0 rgba(196, 148, 29, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
