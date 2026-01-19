export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        noir: {
          bg: '#121212',
          surface: '#1E1E1E',
          gold: '#D4AF37',
          'gold-dim': '#C5A028',
          blood: '#8B0000',
          smoke: '#A8A8A8',
          paper: '#F0F0F0',
          shadow: '#000000',
        }
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
