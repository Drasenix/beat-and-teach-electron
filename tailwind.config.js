/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        // Couleurs principales de ton app
        primary: '#22d3ee', // cyan-400 — accents néon
        background: '#030712', // gray-950 — fond principal
        surface: '#111827', // gray-900 — cartes/zones
        border: '#1f2937', // gray-800 — bordures
        text: {
          primary: '#f3f4f6', // gray-100 — texte principal
          secondary: '#6b7280', // gray-500 — texte secondaire
          accent: '#67e8f9', // cyan-300 — texte mis en valeur
        },
      },
    },
  },
  plugins: [],
};
