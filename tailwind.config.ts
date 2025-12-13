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
        sacredGold: '#C4941D',
        deepEarth: '#5A4A3B',
        spiritualBlue: '#4A7C9C',
        parchment: '#FAF7F2',
        inkBlack: '#2B2418',
        stoneGray: '#8B8070',
        livingGreen: '#5F8A5F',
        gentleAmber: '#D4A574',
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
      },
    },
  },
  plugins: [],
}
export default config
