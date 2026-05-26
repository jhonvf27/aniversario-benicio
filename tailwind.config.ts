import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        bubblegum: ['var(--font-bubblegum)', 'cursive'],
        nunito: ['var(--font-nunito)', 'sans-serif'],
      },
      colors: {
        rosa: '#FF6B9D',
        azul: '#4DAEE5',
        amarelo: '#FFD93D',
        lilas: '#C084FC',
        verde: '#4ADE80',
        fundo: '#FFF9F5',
        texto: '#2D1B69',
      },
      animation: {
        'float-up': 'float-up 12s linear infinite',
        'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
        'spin-slow': 'spin 4s linear infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      },
      keyframes: {
        'float-up': {
          '0%': { transform: 'translateY(110vh) rotate(0deg)', opacity: '0' },
          '5%': { opacity: '1' },
          '90%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-10vh) rotate(20deg)', opacity: '0' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
          '50%': { opacity: '0.4', transform: 'scale(0.7) rotate(15deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255,107,157,0.6), 0 0 40px rgba(255,107,157,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(192,132,252,0.8), 0 0 80px rgba(192,132,252,0.4)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
