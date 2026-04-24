import { driver } from 'driver.js';

export const patternSteps = [
  {
    element: '.content-page',
    popover: {
      title: 'Patterns',
      description: 'Voici la liste de tous tes patterns sauvegardés.',
    },
  },
  {
    element: '.pattern-name',
    popover: {
      title: 'Nom',
      description: 'Chaque pattern possède un nom.',
    },
  },
  {
    element: '.pattern-tracks',
    popover: {
      title: 'Pistes',
      description:
        'Vous pouvez voir les différentes pistes qui composent le pattern.',
    },
  },
  {
    element: '.actions',
    popover: {
      title: 'Actions',
      description: 'Chaque pattern peut-être édité ✎ et supprimé ✕',
    },
  },
  {
    element: '.btn-add',
    popover: {
      title: 'Ajouter',
      description: 'Crée un nouveau pattern depuis le studio.',
    },
  },
];

export const driverConfig = {
  animate: true,
  showProgress: true,
  steps: patternSteps,
};

let driverInstance: ReturnType<typeof driver> | null = null;

export function runPatternTour(): void {
  if (driverInstance) {
    driverInstance.destroy();
  }
  driverInstance = driver(driverConfig);
  driverInstance.drive();
}
