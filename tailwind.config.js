/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        'gold-shine': '#FFD700',
        ink: '#0a0a0a',
        surface: '#f5f5f5',
        darksurface: '#1a1a1a',
        muted: '#888',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: { luxury: '0 18px 60px rgba(0,0,0,.12)' },
    },
  },
  plugins: [],
};
