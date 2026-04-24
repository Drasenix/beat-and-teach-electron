import { driver } from 'driver.js';

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

export const driverConfig = {
  animate: true,
  showProgress: true,
  steps: instrumentSteps,
};

let driverInstance: ReturnType<typeof driver> | null = null;

export function runInstrumentTour(): void {
  if (driverInstance) {
    driverInstance.destroy();
  }
  driverInstance = driver(driverConfig);
  driverInstance.drive();
}

export function hasSeenTour(): boolean {
  return localStorage.getItem('instrument_tour_seen') === 'true';
}

export function markTourSeen(): void {
  localStorage.setItem('instrument_tour_seen', 'true');
}
