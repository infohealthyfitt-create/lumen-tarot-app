import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        void: '#07050f',
        midnight: '#0d0a1c',
        nebula: '#1a1330',
        amethyst: '#3c2a6e',
        gold: {
          DEFAULT: '#d4af6a',
          light: '#e9cf9a',
          dim: '#8a6f3f',
        },
        starlight: '#f4efe6',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px rgba(212, 175, 106, 0.25)',
        card: '0 20px 60px rgba(0,0,0,0.5)',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(circle at 50% 0%, rgba(60,42,110,0.5), transparent 60%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
        flip: {
          from: { transform: 'rotateY(0deg)' },
          to: { transform: 'rotateY(180deg)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
export default config;
