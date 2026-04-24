import { driver } from 'driver.js';

export const librarySteps = [
  {
    element: '.content-page',
    popover: {
      title: 'Bibliothèque',
      description: 'Import et export de tes patterns et instruments.',
    },
  },
  {
    element: '.library-section-title',
    popover: {
      title: 'Sélection rapide',
      description: 'Coche pour sélectionner ou désélectionner tout.',
    },
  },
  {
    element: '.library-item',
    popover: {
      title: 'Items',
      description: 'Sélectionne les patterns et instruments à exporter.',
    },
  },
  {
    element: '#export',
    popover: {
      title: 'Exporter',
      description:
        'Exporte les patterns et instruments selectionnés au format .beatpack (zip).',
    },
  },
  {
    element: '#import',
    popover: {
      title: 'Importer',
      description:
        'Importe des patterns et des instruments à partir de fichiers .beatpack (zip) sur ton ordinateur.',
    },
  },
];

export const driverConfig = {
  animate: true,
  showProgress: true,
  steps: librarySteps,
};

let driverInstance: ReturnType<typeof driver> | null = null;

export function runLibraryTour(): void {
  if (driverInstance) {
    driverInstance.destroy();
  }
  driverInstance = driver(driverConfig);
  driverInstance.drive();
}
