import { driver, Driver } from 'driver.js';

export const studioSteps = [
  {
    element: '.daw-layout',
    popover: {
      title: 'Espace de travail',
      description: "Voici l'écran studio.",
    },
  },
  {
    element: '#patterns-choices',
    popover: {
      title: 'Patterns',
      description: 'Tu peux sélectionner un pattern déjà existant.',
    },
  },
  {
    element: '#instrument-choices',
    popover: {
      title: 'Instruments',
      description:
        'Tu peux retrouver tes différents instruments et rapidement les écouter.',
    },
  },
  {
    popover: {
      title: 'Pattern',
      description: 'Voyons maintenant comment fonctionne un pattern.',
    },
  },
  {
    element: '.daw-main',
    popover: {
      title: 'Pistes',
      description: 'Ici se trouve ton espace de travail.',
    },
  },
  {
    element: '.pattern-section-content .section-background textarea',
    popover: {
      title: 'Pistes',
      description:
        'Tu peux retrouver les différentes pistes qui composent ton pattern.',
    },
  },
  {
    element: '.pattern-section-content .section-background .btn-add',
    popover: {
      title: 'Pistes',
      description: 'Tu peux ajouter une nouvelle piste.',
    },
  },
  {
    element: '.pattern-section-content .section-background .btn-delete',
    popover: {
      title: 'Pistes',
      description: 'Et en supprimer une.',
    },
  },
  {
    element: '#pattern-preview',
    popover: {
      title: 'Pattern',
      description:
        'Cette section te permet de voir le pattern dans sa version finale.',
    },
  },
  {
    element: '#time',
    popover: {
      title: 'Mesure',
      description: 'La longueur de la mesure est visible.',
    },
  },
  {
    element: '#steps',
    popover: {
      title: 'Steps',
      description:
        'Chaque Step est un bouton. Clique dessus pour <b>mute</b> celle-ci. Tu peux aussi assigner une <b>couleur</b> à une step.',
    },
  },
  {
    element: '.step-cell-atomic',
    popover: {
      title: 'Note simple',
      description:
        'Une step correspond à un temps. Par défaut il y a une note par temps.',
    },
  },
  {
    element: '.step-cell-group',
    popover: {
      title: 'Notes multiples',
      description:
        'Utilise <b>()</b> pour découper un temps en autant de notes que tu le souhaites.',
    },
  },
  {
    element: '.transport-controls',
    popover: {
      title: 'Contrôles',
      description:
        'Cette section te permet de contrôler la lecture du pattern. Utilise le raccourci clavier <b>Ctrl+Enter</b> pour déclencher rapidement les actions <b>Play/Stop</b>. Aussi, <b>Ctrl+￪</b> et <b>Ctrl+￬</b> te permetterons de contrôler le <b>tempo</b>.',
    },
  },
  {
    element: '.sidebar-btn-save',
    popover: {
      title: 'Sauvegarde',
      description: 'Sauvegarde ton pattern.',
    },
  },
  {
    element: '.sidebar-btn-new',
    popover: {
      title: 'Nouveau pattern',
      description:
        'Crée un nouveau pattern. Attention, les modifications non sauvegardées seront perdues.',
    },
  },
];

let driverInstance: Driver | null = null;

export function runStudioTour(navigateTo?: (path: string) => void): void {
  if (driverInstance) {
    driverInstance.destroy();
  }

  driverInstance = driver({
    animate: true,
    showProgress: true,
    steps: studioSteps,
    onNextClick: () => {
      const activeIndex = driverInstance?.getActiveIndex() ?? 0;
      let btn: HTMLElement;
      if (activeIndex === 0) {
        btn = document.querySelector('#patterns-choices button') as HTMLElement;
        if (btn) btn.click();
      } else if (activeIndex === 1) {
        btn = document.querySelector('#patterns-choices button') as HTMLElement;
        if (btn) btn.click();
        btn = document.querySelector(
          '#instrument-choices button',
        ) as HTMLElement;
        if (btn) btn.click();
      } else if (activeIndex === 2) {
        btn = document.querySelector(
          '#instrument-choices button',
        ) as HTMLElement;
        if (btn) btn.click();
      } else if (activeIndex === 3) {
        btn = document.querySelector('#patterns-choices button') as HTMLElement;
        if (btn) btn.click();
        btn = document.querySelector(
          '#patterns-choices .sidebar-list button',
        ) as HTMLElement;
        if (btn) btn.click();
      }

      driverInstance?.moveNext();
    },
    onPrevClick: () => {
      const activeIndex = driverInstance?.getActiveIndex() ?? 0;
      let btn: HTMLElement;
      if (activeIndex === 1) {
        btn = document.querySelector('#patterns-choices button') as HTMLElement;
        if (btn) btn.click();
      } else if (activeIndex === 2) {
        btn = document.querySelector('#patterns-choices button') as HTMLElement;
        if (btn) btn.click();
        btn = document.querySelector(
          '#instrument-choices button',
        ) as HTMLElement;
        if (btn) btn.click();
      } else if (activeIndex === 3) {
        btn = document.querySelector(
          '#instrument-choices button',
        ) as HTMLElement;
        if (btn) btn.click();
      } else if (activeIndex === 4) {
        btn = document.querySelector(
          '#patterns-choices .sidebar-footer .sidebar-btn-new',
        ) as HTMLElement;
        if (btn) btn.click();
        btn = document.querySelector('#patterns-choices button') as HTMLElement;
        if (btn) btn.click();
      }

      driverInstance?.movePrevious();
    },
    onDestroyed: () => {
      navigateTo?.('/guide');
    },
  });

  driverInstance.drive();
}
