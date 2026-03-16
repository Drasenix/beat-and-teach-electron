/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        // Couleurs principales de ton app
        primary: '#679ff9', // accents néon
        background: '#030712', // fond principal
        surface: '#1d273c', // cartes/zones
        border: '#1f2937', // bordures
        field: '#111827', // fond text area
        text: {
          primary: '#f3f4f6', // texte principal
          secondary: '#6b7280', // texte secondaire
          accent: '#679ff9', // texte mis en valeur
        },
        button: {
          surface: '#111827', // boutons
          delete: '#990033', // bouton delete
          edit: '#679ff9',
          'confirm-delete': '#770000', // bouton confirm delete
        },
      },
    },
  },
  plugins: [],
};
