# Agent — Beat & Teach Electron

## 1. Identité du projet

- **Projet** : Beat & Teach — composition rythmique symbolique
- **Stack** : Electron + React + TypeScript + Tone.js + SQLite (better-sqlite3) + Tailwind CSS 3
- **Architecture** : feature-sliced (domain-driven), main/renderer séparé, IPC typé
- Le fichier `documentation-métier.md` dans le même dossier contient la référence métier complète

## 2. Règles de développement strictes

- Pas de `for...of` (`.forEach()` obligatoire)
- Pas d'implicit `any` — toujours un type explicite (`const x: Type = ...`)
- Pas d'index comme `key` React — utiliser des ID stables uniques
- Pas d'eslint-disable ou `// eslint-disable-next-line`
- `error: unknown` dans les catch, puis `instanceof Error` pour le type narrowing
- Immutabilité : toujours créer une nouvelle référence pour les tableaux/objets
- Pas de `useEffect` pour les dérivations calculables — utiliser `useMemo`
- **Pas de commentaires dans le code** — le code doit être auto-documenté

## 3. Développement

- **TDD pour le code métier** : parser, validator, mute, adapters, engine, service — écrire le test avant l'implémentation
- **Pas de TDD pour le frontend** : composants React, hooks UI, contexts — tests après ou pas de tests
- **Refactoring systématique** : extraire les fonctions pures, réduire la duplication, simplifier la logique
- **Respecter le style de code existant** : conventions de nommage, patterns, structure de fichiers
- **Force de proposition** : suggérer activement des améliorations d'architecture et de pratiques de dev. Si un pattern, une librairie, ou une approche peut améliorer le codebase, le proposer avec une justification. Ne pas se limiter à exécuter les tickets.

## 4. Architecture et patterns

- **Feature-sliced** : chaque domaine suit `models/types/adapters/services/facade/engine/hooks/contexts/components/utils`
- **Nommage strict** : `*-dto.ts`, `*-facade.ts`, `*-adapter.ts`, `*-engine.ts`, `*-service.ts`, `*-model.ts`
- **Providers** : `AudioProvider > PatternsProvider > InstrumentsProvider > GuideModalProvider`
- **Facade** = API publique du domaine — les composants n'appellent que les facades, jamais les services directement
- **Adapter** = mapping DTO (main) ↔ Modèle (renderer)
- **Singleton pour la logique métier** : `AudioEngine`, `InstrumentEngine`
- **Validation des données** : toujours valider côté main ET côté renderer
- **État global réservé aux données partagées** (listes patterns/instruments, session audio). Tout le reste en état local (`useState` dans le composant)

## 5. Conventions par domaine

### Pattern

- `usePattern` = état local d'un pattern en cours d'édition
- `usePatternSession` = wrapper avec gestion du mute (Set<string> de clés "sentenceIndex-tokenIndex")
- `usePatternForm` = gestion de formulaire avec synchronisation des highlights
- Parser = fonctions pures dans `pattern-parser.ts`
- Normalisation automatique des phrases non-racines sur la longueur de la première

### Instruments

- `InstrumentEngine` (singleton) pour la résolution symbole → nom/chemin
- L'instrument `symbol: "."` est toujours filtré de l'UI
- Slug auto-généré via `toSnakeCase()` — valide `[a-z0-9-]`
- Les chemins audio relatifs sont résolus par rapport à `assets/audio/` ou `resources/assets/audio/`

### Audio

- `AudioEngine` (singleton) encapsule Tone.js
- `createSequence(tracks)` = un `Tone.Sequence` par piste, subdivision `'8n'`
- Groupes `(…)` → `SequenceNote[]` (tableau) — Tone.js dispatche chaque élément à la même position temporelle
- Step callback = `Tone.Loop` à `'8n'` → `activeStep` pour l'UI
- BPM clampé 1-300 (UI slider 40-240)

### Sequence

- `preparePattern(sentence)` → `SequenceNotes[]` = `(string | null | string[])[]`
- `prepareFilePaths(sentence)` → `InstrumentFilePath[]` (symboles uniques dédupliqués)
- Regex de parsing : `/\(([^)]*)\)|(\S+)/g`

### Library

- `.beatpack` = ZIP avec `manifest.json` + `audio/*`
- Export : archiver (store level), Import : adm-zip
- `ConflictAction` : `'overwrite' | 'skip' | 'rename'`
- Fichiers audio importés copiés dans `userData/imported-audio/`

## 6. Communication Main/Renderer

- 16 channels IPC typés dans `preload.ts` (type `Channels`)
- Tous les handlers enregistrés dans `icpEvents.ts`
- Exposé via `window.electron.ipcRenderer.invokeMessage(channel, ...args)`
- Toujours typer le channel — ne pas utiliser de `string` brut
- Utiliser `extractIpcError()` dans les catch renderer pour nettoyer le message avant affichage

## 7. Tests

- **Framework** : Jest + jsdom
- **Commande** : `npm run test`
- **Configuration** : ts-jest avec `tsconfig.renderer.json`
- **Mocks** : `electron`, `better-sqlite3` pour les tests main process
- **Structure** : Given / When / Then dans les blocs `describe('#methodName')`
- **TDD** : écrire le test avant l'implémentation pour toute la logique métier (parser, validateur, adapters, engine, services)

## 8. Commandes de développement

| Commande | Usage |
|----------|-------|
| `npm start` | Dev complet (webpack + electronmon) |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint auto-fix |
| `npm run test` | Tests Jest |
| `npm run build` | Build production |
| `npm run package` | Package electron-builder |

## 9. Pièges et rappels

- DTO `sentences` et `highlights` sont des `string` (JSON) dans la base — toujours parser avec `JSON.parse()` et stringifier avec `JSON.stringify()`
- Les DTO n'ont pas de suffixe `DTO` pour les types auto-descriptifs (`LibraryManifest`, `ConflictResolution`)
- Ne pas oublier de filtrer l'instrument `.` de tous les affichages
- La normalisation des phrases se fait côté renderer ET côté main — elle doit être cohérente
- `toSnakeCase()` génère des slugs avec `-` (pas `_`)
- Tone.Sequence callback reçoit `(time, value)` — si value est un array, chaque élément est dispatché individuellement

## 10. Project Structure

```
src/
├── main/                          # Electron main process
│   ├── main.ts                    # Entry point
│   ├── preload.ts                 # contextBridge
│   ├── icpEvents.ts               # IPC handlers
│   ├── menu.ts                    # App menu
│   ├── util.ts                    # resolveHtmlPath
│   ├── audio/                     # Audio file reading (main process)
│   ├── db/                        # SQLite (migrations, repositories, services)
│   └── library/                   # Import/export services
├── renderer/                      # React renderer process
│   ├── App.tsx                    # Root + Router + Providers
│   ├── App.css                    # Global styles, Tailwind components, scrollbar
│   ├── preload.d.ts               # Window.electron type declaration
│   ├── components/                # Shared UI (Home, Header, SideBar, Modal)
│   ├── hooks/                     # Shared hooks (useResizable, useSlider, etc.)
│   ├── utils/                     # Utility functions
│   └── features/                  # Feature modules (domain-driven):
│       ├── audio/                 # Audio engine, Tone.js, context
│       ├── autocomplete/          # Autocomplete with symbol filtering
│       ├── instruments/           # Instrument CRUD, engine, validator
│       ├── pattern/               # Pattern composer, parser, validator
│       ├── sequence/              # Sequence service, adapter, facade
│       ├── library/               # Import/export, preview modal
│       ├── guide/                 # Documentation, shortcuts, tours
│       └── onboarding/            # driver.js guided tours
└── shared/
    ├── models/                    # DTOs (pattern-dto, instrument-dto, library-dto)
    └── types/                     # Type definitions (FilePath, InstrumentFilePath, AudioFileBuffer)
```

## 11. TypeScript Configs

| File                         | Purpose                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| `tsconfig.json`              | Base: ES2022, strict, Jest types                                                    |
| `tsconfig.main.json`         | Main process: `module: node16`, includes `src/main/**` + `src/shared/**`            |
| `tsconfig.renderer.json`     | Renderer: `module: esnext`, `dom` lib, includes `src/renderer/**` + `src/shared/**` |
| `src/renderer/tsconfig.json` | Extends renderer config, sets `rootDir`                                             |

Jest uses `tsconfig.renderer.json` for ts-jest transform.

## 12. Styling

- **Tailwind CSS 3** with custom theme colors (voir documentation-métier.md §7)
- Global webkit scrollbar styles in `App.css` (3px wide, primary colored)
- `.content-page` has `bg-background h-screen overflow-y-auto` for proper scroll containment
- `.section-collapsible.open` needs `flex flex-col flex-1 min-h-0` for scroll to work
- Scroll must be on `.section-collapsible.open`, not on `.sidebar-list`

## 13. Key Files

| File                        | Purpose                                                              |
| --------------------------- | -------------------------------------------------------------------- |
| `src/renderer/App.css`      | Global styles, Tailwind components, scrollbar                        |
| `tailwind.config.js`        | Custom colors (primary, background, surface, border, field, text.*)  |
| `src/main/icpEvents.ts`     | All IPC handlers                                                     |
| `src/main/preload.ts`       | IPC channel type definitions                                         |
| `src/renderer/preload.d.ts` | `Window.electron` type declaration                                   |
| `jest.config.js`            | Jest config with ts-jest pointing to tsconfig.renderer.json          |

## 14. Gestion de la documentation .agent

- **Conflit prompt vs documentation** : si une demande utilisateur entre en conflit avec le contenu de `documentation-métier.md` ou `agent.md`, le signaler explicitement avant d'agir. Expliquer la contradiction et demander clarification.
- **Mise à jour proactive** : si au fil du développement tu constates que des informations des fichiers `.md` sont obsolètes, incomplètes, ou pourraient être enrichies, proposer une mise à jour. Ne pas modifier sans accord explicite.

## 15. Gestion des features

- Les specs des nouvelles features sont documentées dans `.agent/features/<feature-name>.md`
- Voir `.agent/new-feature.md` pour le cycle de vie complet
- Workflow : specs → documentation → évolution → suppression sur validation utilisateur
