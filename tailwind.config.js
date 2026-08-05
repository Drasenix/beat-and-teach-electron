/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        // Couleurs principales de ton app
        primary: 'rgb(var(--bt-primary) / <alpha-value>)', // accents néon
        background: 'rgb(var(--bt-background) / <alpha-value>)', // fond principal
        surface: 'rgb(var(--bt-surface) / <alpha-value>)', // cartes/zones
        border: 'rgb(var(--bt-border) / <alpha-value>)', // bordures
        field: 'rgb(var(--bt-field) / <alpha-value>)', // fond text area
        text: {
          primary: 'rgb(var(--bt-text-primary) / <alpha-value>)', // texte principal
          secondary: 'rgb(var(--bt-text-secondary) / <alpha-value>)', // texte secondaire
          accent: 'rgb(var(--bt-text-accent) / <alpha-value>)', // texte mis en valeur
        },
        button: {
          surface: 'rgb(var(--bt-button-surface) / <alpha-value>)', // boutons
          delete: 'rgb(var(--bt-button-delete) / <alpha-value>)', // bouton delete
          edit: 'rgb(var(--bt-button-edit) / <alpha-value>)',
          'confirm-delete':
            'rgb(var(--bt-button-confirm-delete) / <alpha-value>)', // bouton confirm delete
        },
      },
    },
  },
  plugins: [],
};
