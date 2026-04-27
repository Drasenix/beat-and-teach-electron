import { driver, Driver } from 'driver.js';

export const instrumentSteps = [
  {
    element: '.content-page',
    popover: {
      title: 'Instruments',
      description: 'Voici la liste de tous tes instruments.',
    },
  },
  {
    element: '.instrument-play-btn',
    popover: {
      title: '▶ Écouter',
      description: 'Clique sur le bouton play pour écouter un instrument.',
    },
  },
  {
    element: '.instrument-symbol',
    popover: {
      title: 'Symboles',
      description:
        'Chaque instrument est identifié par un symbole unique. Utilise le pour composer.',
    },
  },
  {
    element: '.instrument-name',
    popover: {
      title: 'Nom',
      description: 'Chaque instrument possède également un nom.',
    },
  },
  {
    element: '.instrument-filepath',
    popover: {
      title: 'Fichier',
      description: 'Le fichier audio qui lui est associé.',
    },
  },
  {
    element: '.actions',
    popover: {
      title: 'Actions',
      description: 'Chaque instrument peut-être édité ✎ et supprimé ✕',
    },
  },
  {
    element: '.btn-add',
    popover: {
      title: 'Ajouter',
      description:
        'Ajoute tes propres instruments en sélectionner un fichier audio.',
    },
  },
];

let driverInstance: Driver | null = null;

export function runInstrumentTour(navigateTo?: (path: string) => void): void {
  if (driverInstance) {
    driverInstance.destroy();
  }
  driverInstance = driver({
    animate: true,
    showProgress: true,
    steps: instrumentSteps,
    onDestroyed: () => {
      navigateTo?.('/guide');
    },
  });
  driverInstance.drive();
}
