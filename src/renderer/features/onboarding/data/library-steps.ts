import { driver, Driver } from 'driver.js';

export const librarySteps = [
  {
    element: '.content-page',
    popover: {
      title: 'Bibliothèque',
      description: 'Import et export de tes patterns et instruments.',
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
    element: '.library-section-title',
    popover: {
      title: 'Sélection rapide',
      description: 'Coche pour tout sélectionner ou désélectionner.',
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
let driverInstance: Driver | null = null;

export function runLibraryTour(navigateTo?: (path: string) => void): void {
  if (driverInstance) {
    driverInstance.destroy();
  }
  driverInstance = driver({
    animate: true,
    showProgress: true,
    steps: librarySteps,
    onDestroyed: () => {
      navigateTo?.('/guide');
    },
  });
  driverInstance.drive();
}
