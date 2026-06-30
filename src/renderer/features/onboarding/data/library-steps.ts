import { createTour, TourStep } from '../utils/createTour';

const librarySteps: TourStep[] = [
  {
    element: '.content-page',
    popover: {
      title: 'Bibliothèque',
      description:
        'Importe et exporte tes patterns et instruments pour les partager ou les sauvegarder au format .beatpack (zip).',
    },
  },
  {
    element: '.library-item',
    popover: {
      title: 'Sélection',
      description:
        'Coche les patterns et instruments que tu veux exporter. Tu peux en sélectionner plusieurs à la fois.',
    },
  },
  {
    element: '.library-section-title',
    popover: {
      title: 'Sélection rapide',
      description:
        "Coche la case principale pour tout sélectionner ou tout désélectionner d'un coup. Si seuls certains éléments sont cochés, la case est en état intermédiaire.",
    },
  },
  {
    element: '#export',
    popover: {
      title: 'Exporter',
      description:
        'Exporte les éléments sélectionnés au format .beatpack. Un fichier zip contenant le manifeste et les fichiers audio sera créé.',
    },
  },
  {
    element: '#import',
    popover: {
      title: 'Importer',
      description:
        "Importe un fichier .beatpack depuis ton ordinateur. En cas de conflit (nom déjà existant), tu pourras choisir d'écraser, ignorer ou renommer chaque élément.",
    },
  },
];

export { librarySteps };

export const runLibraryTour = createTour(librarySteps);
