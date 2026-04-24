export interface GuideExample {
  label: string;
  pattern: string;
  description?: string;
}

export interface GuideSection {
  id: string;
  title: string;
  content: string;
  examples?: GuideExample[];
  codeBlocks?: { code: string; description: string }[];
}

export const guideContent: GuideSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    content:
      'Beat & Teach est une application de composition musicale éducatif. Écris ton pattern avec des symboles, écoute le résultat, et apprends les rythmes.',
  },
  {
    id: 'syntax',
    title: 'Composer un beat',
    content:
      'Chaque instrument est représenté par un symbole. Écris-les simplement dans le champ de saisie, séparés par des espaces.',
    codeBlocks: [
      {
        code: 'P Ts K P Ts K P .',
        description: 'Exemple : Kick, Rimshot, Kick, etc.',
      },
      {
        code: 'K . K . K . K .',
        description: 'Le point (.) représente un silence.',
      },
    ],
    examples: [
      {
        label: 'Kick simple',
        pattern: 'K . K . K . K .',
      },
      {
        label: 'Kick Snare',
        pattern: 'K . K . S . K . K .',
      },
      {
        label: 'Beat complet',
        pattern: 'P Ts K P Ts K P .',
      },
    ],
  },
  {
    id: 'instruments',
    title: 'Les instruments',
    content:
      "Plusieurs types d'instruments sont disponibles : Percussions (P, K, S, Ts...), Air sounds (A<, A>, F<, F>) pour le beatbox, et personnalisés.",
    examples: [
      {
        label: 'Percussions',
        pattern: 'P K S Ts',
        description: 'P=Kick, K=Snare, S=Snare, Ts=Tom',
      },
      {
        label: 'Air sounds',
        pattern: 'A< A> F< F>',
        description: 'A<, A>=A, F<, F>=F en beatbox',
      },
    ],
  },
  {
    id: 'grouping',
    title: 'Regroupement (Grouping)',
    content:
      'Utilise les parenthèses () pour jouer plusieurs instruments simultanément sur un même temps. Cela permet de créer des polyrythmies.',
    codeBlocks: [
      {
        code: '(Ts K)',
        description: 'Joue Ts et K en même temps',
      },
      {
        code: '(P S K)',
        description: 'Triple son sur un temps',
      },
    ],
    examples: [
      {
        label: 'Polyrythmie simple',
        pattern: 'P (Ts K) P (Ts K)',
      },
      {
        label: 'Triple sur temps',
        pattern: '(P S K) . (P S K) .',
      },
      {
        label: 'Double-time feel',
        pattern: '(K P) (K P) (K P) (K P)',
      },
    ],
  },
  {
    id: 'colors',
    title: 'Couleurs (Surlignage)',
    content:
      "Survole n'importe quel step dans le studio et sélectionne une couleur pour le marquer visuellement. Utile pour apprendre et mémoriser les patterns.",
    codeBlocks: [
      {
        code: 'Rouge, Bleu, Vert, Jaune, Orange',
        description: '5 couleurs disponibles',
      },
    ],
  },
  {
    id: 'shortcuts',
    title: 'Raccourcis clavier',
    content: "Ces raccourcis t'aideront à composer plus vite.",
    codeBlocks: [
      {
        code: 'Ctrl + Entrée',
        description: 'Play / Stop la lecture',
      },
      {
        code: 'Ctrl + ↑ / ↓',
        description: 'Augmenter / Diminuer le BPM',
      },
      {
        code: '( ) avec sélection',
        description: 'Entoure le texte sélectionné avec des parenthèses',
      },
      {
        code: '↓ / ↑ dans saisie',
        description: "Naviguer dans les suggestions d'autocomplete",
      },
      {
        code: 'Tab / Entrée',
        description: "Valider une suggestion d'autocomplete",
      },
      {
        code: 'Ctrl + → / ←',
        description: 'Déplacer le curseur mot par mot',
      },
      {
        code: 'Shift + Ctrl + → / ←',
        description: 'Sélectionner mot par mot',
      },
    ],
  },
  {
    id: 'library',
    title: 'Bibliothèque',
    content:
      "La bibliothèque te permet d'importer et exporter tes patterns et instruments. Le format .beatpack regroupe tout (patterns + sons) dans un fichier ZIP.",
    codeBlocks: [
      {
        code: 'Exporter',
        description:
          'Sélectionne patterns + instruments → téléchargements .beatpack',
      },
      {
        code: 'Importer',
        description:
          'Charge un fichier .beatpack → aperçu → résolution des conflits',
      },
    ],
  },
];
