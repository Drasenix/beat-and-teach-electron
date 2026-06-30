import { Driver } from 'driver.js';
import { createTour, TourStep } from '../utils/createTour';

function setSectionState(selector: string, shouldBeOpen: boolean): void {
  const sectionEl = document.querySelector(selector);
  if (!sectionEl) return;
  const button = sectionEl.querySelector(
    '.sidebar-header',
  ) as HTMLElement | null;
  if (!button) return;
  const collapsible = sectionEl.querySelector('.section-collapsible');
  const isCurrentlyOpen = collapsible?.classList.contains('open') ?? false;
  if (isCurrentlyOpen !== shouldBeOpen) {
    button.click();
  }
}

function openPatterns(): void {
  setSectionState('#patterns-choices', true);
}

function closePatterns(): void {
  setSectionState('#patterns-choices', false);
}

function openInstruments(): void {
  setSectionState('#instrument-choices', true);
}

function closeInstruments(): void {
  setSectionState('#instrument-choices', false);
}

function selectFirstPattern(): void {
  const firstPatternButton = document.querySelector(
    '#patterns-choices .sidebar-list button',
  ) as HTMLElement | null;
  if (firstPatternButton) {
    firstPatternButton.click();
  }
}

function clickNewPattern(): void {
  const newButton = document.querySelector(
    '#patterns-choices .sidebar-footer .sidebar-btn-new',
  ) as HTMLElement | null;
  if (newButton) {
    newButton.click();
  }
}

const studioSteps: TourStep[] = [
  {
    element: '.daw-layout',
    popover: {
      title: 'Espace de travail',
      description:
        "Bienvenue dans le studio. C'est ici que tu composes : ajoute des pistes, écris des symboles, et écoute le résultat en temps réel.",
    },
  },
  {
    element: '#patterns-choices',
    popover: {
      title: 'Patterns',
      description:
        "Sélectionne un pattern existant dans la liste pour le modifier ou t'en inspirer. Tu peux aussi en créer un nouveau avec le bouton « Nouveau pattern ».",
    },
  },
  {
    element: '#instrument-choices',
    popover: {
      title: 'Instruments',
      description:
        'Retrouve tes instruments ici. Chacun a un symbole unique (P, Ts, K…). Clique sur le bouton ▶ pour pré-écouter un instrument.',
    },
  },
  {
    element: '.pattern-section-content .section-background textarea',
    popover: {
      title: 'Pistes',
      description:
        'Écris les symboles des instruments séparés par des espaces. Exemple : <b>P Ts K . P (Ts P) K</b>. Chaque ligne est une piste différente. Utilise <b>()</b> pour mettre plusieurs notes sur un même temps.',
    },
  },
  {
    element: '#pattern-preview',
    popover: {
      title: 'Grille',
      description:
        "La grille affiche le pattern complet. Chaque colonne est un temps. Survole une step pour ouvrir le panneau d'édition avec les options muet, couleurs et sélecteur de note.",
    },
  },
  {
    popover: {
      title: "Panneau d'édition",
      description:
        'Le panneau apparaît au survol d\'une step. Il permet de :<br/><br/><span class="text-primary font-bold">Muet</span> : Couper le son sans effacer le symbole.<br/><span class="text-primary font-bold">Couleurs</span> : 5 couleurs pour annoter (temps fort, liaison, ghost note, accent, syncope).<br/><span class="text-primary font-bold">Note</span> : Ajuster la hauteur perçue (si l\'instrument a une fréquence de référence).<br/><span class="text-primary font-bold">Molette</span> : Ajuster la hauteur par demi-tons.<br/><span class="text-primary font-bold">Double-clic</span> : Réinitialiser la hauteur.',
    },
  },
  {
    element: '.step-cell-atomic',
    popover: {
      title: 'Note simple',
      description:
        "Un symbole par temps. Le silence est représenté par <b>.</b> et s'affiche en grisé.",
    },
  },
  {
    element: '.step-cell-group',
    popover: {
      title: 'Notes multiples',
      description:
        "Avec <b>()</b>, tu découpes un temps en plusieurs notes jouées rapidement à l'intérieur de la même pulsation. Exemple : <b>(Ts P)</b> joue Ts puis P dans un seul temps.",
    },
  },
  {
    element: '.transport-controls',
    popover: {
      title: 'Contrôles',
      description:
        'Utilise ▶ Play pour écouter le pattern, ■ Stop pour arrêter. Raccourci : <b>Ctrl+Enter</b>. Ajuste le tempo avec le slider ou avec <b>Ctrl+↑</b> et <b>Ctrl+↓</b>.',
    },
  },
  {
    element: '.sidebar-btn-save',
    popover: {
      title: 'Sauvegarde',
      description:
        'Sauvegarde ton travail régulièrement. Le pattern est stocké dans ta bibliothèque et tu peux le retrouver plus tard.',
    },
  },
];

export { studioSteps };

export const runStudioTour = createTour(studioSteps, {
  onNextClick: (driverInstance: Driver): void => {
    const activeIndex = driverInstance.getActiveIndex() ?? 0;

    if (activeIndex === 0) {
      openPatterns();
    } else if (activeIndex === 1) {
      closePatterns();
      openInstruments();
    } else if (activeIndex === 2) {
      closeInstruments();
      openPatterns();
      selectFirstPattern();
    }

    driverInstance.moveNext();
  },
  onPrevClick: (driverInstance: Driver): void => {
    const activeIndex = driverInstance.getActiveIndex() ?? 0;

    if (activeIndex === 1) {
      openPatterns();
    } else if (activeIndex === 2) {
      openPatterns();
      openInstruments();
    } else if (activeIndex === 3) {
      openInstruments();
    } else if (activeIndex === 4) {
      openPatterns();
      clickNewPattern();
    }

    driverInstance.movePrevious();
  },
});
