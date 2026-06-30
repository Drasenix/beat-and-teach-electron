import { createTour, TourStep } from '../utils/createTour';

const instrumentSteps: TourStep[] = [
  {
    element: '.content-page',
    popover: {
      title: 'Instruments',
      description:
        'Voici la liste de tous tes instruments. Tu peux les éditer, les supprimer, ou en ajouter de nouveaux avec tes propres fichiers audio.',
    },
  },
  {
    element: '.instrument-play-btn',
    popover: {
      title: 'Écouter',
      description:
        "Clique sur ▶ pour pré-écouter un instrument. Utile pour vérifier le son avant de l'utiliser dans un pattern.",
    },
  },
  {
    element: '.instrument-symbol',
    popover: {
      title: 'Symboles',
      description:
        'Chaque instrument a un symbole unique (P, Ts, K…). Tape ces symboles dans une piste au studio pour composer ton rythme.',
    },
  },
  {
    element: '.instrument-name',
    popover: {
      title: 'Nom',
      description:
        "Le nom lisible t'aide à identifier l'instrument. Exemple : le symbole P correspond au kickdrum.",
    },
  },
  {
    element: '.instrument-filepath',
    popover: {
      title: 'Fichier',
      description:
        "Le fichier audio (.mp3, .wav, .ogg) associé à l'instrument. C'est ce fichier qui est joué quand le symbole apparaît dans la grille.",
    },
  },
  {
    element: '.actions',
    popover: {
      title: 'Actions',
      description:
        "✎ Édite l'instrument pour changer son nom, son symbole ou son fichier audio. ✕ Supprime-le définitivement.",
    },
  },
  {
    element: '.btn-add',
    popover: {
      title: 'Ajouter',
      description:
        'Ajoute tes propres instruments en choisissant un fichier audio sur ton ordinateur (mp3, wav, ogg). Le symbole te servira à le noter dans tes patterns.',
    },
  },
];

export { instrumentSteps };

export const runInstrumentTour = createTour(instrumentSteps);
