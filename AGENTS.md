# AGENTS.md — Beat & Teach Electron

## Overview

Desktop music learning app ("Beat & Teach") built on Electron React Boilerplate.
Compose beat patterns, configure instruments, sequence audio, and manage a pattern/instrument library.

## Commands

| Command                  | Description                                      |
| ------------------------ | ------------------------------------------------ |
| `npm start`              | Full dev mode (webpack + electronmon hot reload) |
| `npm run start:main`     | Watch main process only                          |
| `npm run start:renderer` | Dev server for renderer only                     |
| `npm run build`          | Production build (main + renderer)               |
| `npm run package`        | Clean, build, and package via electron-builder   |
| `npm run lint`           | ESLint across all files                          |
| `npm run lint:fix`       | ESLint with auto-fix                             |
| `npm run test`           | Jest (jsdom environment)                         |

## Project Structure

```
src/
├── main/                          # Electron main process
│   ├── main.ts                    # Entry point
│   ├── preload.ts                 # contextBridge
│   ├── icpEvents.ts               # IPC handlers
│   ├── audio/                     # Audio service (main process)
│   ├── db/                        # SQLite (migrations, repositories, services)
│   └── library/                   # Import/export services
├── renderer/                      # React renderer process
│   ├── App.tsx                    # Root + Router + Providers
│   ├── components/                # Shared UI (Home, Header, SideBar, Modal)
│   ├── hooks/                     # Shared hooks
│   ├── utils/                     # Utility functions
│   └── features/                  # Feature modules (domain-driven):
│       ├── audio/                 # Audio engine, Tone.js, context
│       ├── autocomplete/          # Autocomplete with "/" patterns
│       ├── instruments/           # Instrument CRUD, engine, validator
│       ├── pattern/               # Pattern composer, parser, validator
│       ├── sequence/              # Sequence service, adapter, facade
│       └── library/               # Import/export, preview modal
└── shared/
    ├── models/                    # DTOs (pattern-dto, instrument-dto, library-dto)
    └── types/                     # Type definitions (FilePath, InstrumentFilePath, etc.)
```

## Architecture

- **Electron React Boilerplate** — split main/renderer with separate webpack configs
- **Feature-sliced / domain-driven** — each feature owns its components, services, adapters, facade, hooks, contexts, types, tests
- **Context providers** — `InstrumentsProvider`, `PatternsProvider`, `AudioProvider` wrap the app
- **Facade pattern** — `*-facade.ts` is the public API between UI and internal services
- **Adapter pattern** — `*-adapter.ts` maps between DTOs and UI representations
- **Engine pattern** — `instrument-engine.ts`, `audio-engine.ts` encapsulate core domain logic
- **SQLite** — main process persistence with migrations, repositories, fetch services
- **IPC** — `icpEvents.ts` registers handlers; `preload.ts` exposes typed channels via contextBridge

## Code Conventions

### STRICT RULES

- **No `for...of` loops** — use `.forEach()` instead
- **No implicit `any`** — always explicit typing (`const x: Type = ...`)
- **No array index in React `key` props** — use stable unique IDs
- **`DTO` suffix** for types that travel between main and renderer (e.g. `PatternDTO`, `InstrumentDTO`)
- **No `DTO` suffix** for self-descriptive types (e.g. `LibraryManifest`, `ConflictResolution`)
- **Master checkbox pattern** for select all/deselect all (like Gmail)
- **No ESLint disable** — never use `eslint-disable` or `// eslint-disable-next-line` comments

### NAMING

- DTO files: `*-dto.ts` (not `*-db.ts`)
- Types shared between processes live in `src/shared/`
- Test files: `*.test.ts` alongside feature structure in `tests/` subdirectories

### PATTERNS

- **Render prop pattern** used for `LibrarySection` (children as function) for flexible item rendering
- **Local vs parent-managed state** — decide carefully; LibrarySection manages its own selection state internally
- **`error: unknown`** in catch blocks, then narrow with `instanceof Error`

## TypeScript Configs

| File                         | Purpose                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------- |
| `tsconfig.json`              | Base: ES2022, strict, Jest types                                                    |
| `tsconfig.main.json`         | Main process: `module: node16`, includes `src/main/**` + `src/shared/**`            |
| `tsconfig.renderer.json`     | Renderer: `module: esnext`, `dom` lib, includes `src/renderer/**` + `src/shared/**` |
| `src/renderer/tsconfig.json` | Extends renderer config, sets `rootDir`                                             |

Jest uses `tsconfig.renderer.json` for ts-jest transform.

## Testing

- **Jest** with jsdom environment
- **ts-jest** configured with `tsconfig.renderer.json`
- Mock `electron` and `better-sqlite3` for main process tests
- Use `jest.mock('fs')`, `jest.mock('archiver')`, etc. for I/O
- Test structure: Given / When / Then comments
- `describe('#methodName')` for method-level test blocks

## Styling

- **Tailwind CSS 3** with custom theme colors
- Global webkit scrollbar styles in `App.css`
- `.content-page` has `bg-background h-screen overflow-y-auto` for proper scroll containment
- `.section-collapsible.open` needs `flex flex-col flex-1 min-h-0` for scroll to work
- Scroll must be on `.section-collapsible.open`, not on `.sidebar-list`

## Key Files

| File                        | Purpose                                                              |
| --------------------------- | -------------------------------------------------------------------- |
| `src/renderer/App.css`      | Global styles, Tailwind components, scrollbar                        |
| `tailwind.config.js`        | Custom colors (primary, background, surface, border, field, text.\*) |
| `src/main/icpEvents.ts`     | All IPC handlers                                                     |
| `src/main/preload.ts`       | IPC channel type definitions                                         |
| `src/renderer/preload.d.ts` | `Window.electron` type declaration                                   |
| `jest.config.js`            | Jest config with ts-jest pointing to tsconfig.renderer.json          |

## Accomplished

### Sidebar

- Scrollable sections for PatternChoices and InstrumentLegend with `flex-col min-h-0` layout
- Alphabetical sorting: patterns by name, instruments sorted by symbol
- Play button on each instrument in InstrumentsLegend and InstrumentConfiguration, wired to `AudioFacade.playInstrument()`
- Scrollbar track color fixed: `.main-container` needs `h-screen overflow-y-auto` to prevent body-level white scrollbar

### Bibliothèque (Library) — `/library`

- Full import/export of patterns and instruments as `.beatpack` ZIP files
- Export: bundles `manifest.json` + audio files into ZIP via `archiver`
- Import: extracts ZIP via `adm-zip`, previews items, handles conflicts (overwrite / skip / rename)
- `ImportPreviewModal` with conflict resolution UI
- `LibrarySection` generic component with local state and render prop
- `ImportableSection` with master checkbox (select all / deselect all)
- Navigation: route `/library`, nav item in Header, link on Home
- Instrument with `slug === "."` filtered from display

### Infrastructure

- IPC handlers in `main/icpEvents.ts`, typed channels via `preload.ts`
- Renderer service + facade pattern for library operations
- Types in `library-dto.ts` (no DTO suffix — self-descriptive)
- DTOs renamed from `-db.ts` to `-dto.ts` (`pattern-dto.ts`, `instrument-dto.ts`)
- `types: ["jest"]` in `tsconfig.main.json` for Jest globals
- `types: ["jest"]` in `tsconfig.json` base config
- `ts-jest` configured to use `tsconfig.renderer.json` in `jest.config.js`
- Mock `electron` + `better-sqlite3` required for main process tests

### Components

- `SentenceInput`: wrap selection with `()` on keyboard press
- `InstrumentsConfiguration`: play button added per instrument row
