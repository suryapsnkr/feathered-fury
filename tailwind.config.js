/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        game: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          gold: '#facc15',
          sky: '#38bdf8',
          grass: '#84cc16'
        }
      }
    },
  },
  plugins: [],
};
