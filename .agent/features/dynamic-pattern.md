# Feature: dynamic-pattern

## Règle d'implémentation

**TDD strict obligatoire** : pour chaque phase, écrire le test en premier → `npm run test` doit échouer → implémenter le code → `npm run test` doit passer → passer à la phase suivante. Ne jamais écrire de code métier avant son test.

## Specs

Mise à jour dynamique de la séquence audio pendant la lecture, sans Stop + Play.

### Scénarios

1. **Étant donné que** je clique sur Play et que la séquence est en cours de lecture
   **Quand** j'ajoute un symbole (instrument) **valide** dans le pattern
   **Alors** la séquence est mise à jour dynamiquement
   **Et** l'instrument est joué sans avoir à Stop + Play

2. **Étant donné que** je clique sur Play et que la séquence est en cours de lecture
   **Quand** j'ajoute un symbole (instrument) **non valide** dans le pattern
   **Alors** la séquence **n'est pas** mise à jour dynamiquement

3. **Étant donné que** je clique sur Play et que la séquence est en cours de lecture
   **Quand** j'ajoute un symbole non valide dans le pattern
   **Et** que j'ajoute un symbole valide
   **Alors** la séquence **n'est pas** mise à jour dynamiquement
   **Puis** que je corrige/supprime le symbole non valide
   **Alors** la séquence est mise à jour dynamiquement **et** inclut tous les changements valides qui étaient en attente

### Contraintes

- L'édition UI (textarea, grille, mute) reste réactive en toute circonstance
- Seule la poussée vers le moteur audio est conditionnée à la validité
- Un symbole invalide = aucun instrument trouvé dans la base (ni dans InstrumentEngine)
- Le silence `.` est toujours considéré valide
- Si un nouvel instrument valide est ajouté, son fichier audio doit être chargé (IPC + decodeAudioData) avant d'être joué
- Le nombre de pistes peut varier pendant la lecture (ajout/suppression de phrases)
- Un toggle de mute pendant la lecture met aussi à jour dynamiquement la séquence

---

## État du codebase — ce qui existe

### Architecture du flux Play actuel

```
PatternWorkspace
  │  usePatternSession() → sentencesForPlayback (mute-transformé)
  │  useAudio() → { playing, playTrack, stopTrack, activeStep }
  ▼
AudioControls (onClick Play)
  ▼
AudioContext.playTrack(sentences, bpm)
  ▼
audio-facade.playPattern(sentences, bpm, onStep)
  ├── prepareAudioEngine(sentences, bpm, onStep)
  │     ├── audioEngine.setTempo(bpm)
  │     ├── createAudioBuffers(sentences)
  │     │     ├── prepareFilePaths(sentence) → InstrumentFilePath[]
  │     │     ├── IPC 'get-audio-buffers' → AudioFileBuffer
  │     │     └── audioEngine.createPlayers(buffers)
  │     ├── preparePattern(sentence) → SequenceNotes[]
  │     └── audioEngine.createSequence(allNotes) → Tone.Sequence[]
  └── audioEngine.play() → Tone.start() + Transport.start('+0.1')
```

### Fichiers clés existants (avec fonctions publiques)

| Fichier | Fonctions publiques |
|---------|-------------------|
| `src/renderer/features/audio/engine/audio-engine.ts` | `getInstance()`, `setTempo(bpm)`, `createPlayers(buffers)`, `createSequence(tracks)`, `play()`, `stop()`, `playInstrument(name)`, `setStepCallback(cb)`, `clearStepCallback()` |
| `src/renderer/features/audio/facade/audio-facade.ts` | `playPattern(sentences, bpm, onStep?)`, `stopPattern()`, `changeTempo(bpm)`, `playInstrument(filepath, name)` |
| `src/renderer/features/audio/contexts/AudioContext.tsx` | `useAudioContext()` → `{ playing, activeStep, playTrack, stopTrack, changeBpm, playInstrument }` |
| `src/renderer/features/audio/hooks/useAudio.tsx` | `useAudio()` → `useAudioContext()` |
| `src/renderer/features/sequence/service/sequence-service.ts` | `prepareFilePaths(sentence)`, `preparePattern(sentence)` |
| `src/renderer/features/sequence/types/sequence-note.ts` | `SequenceNote = string \| null`, `SequenceNotes = SequenceNote \| SequenceNote[]` |
| `src/renderer/features/instruments/engine/instrument-engine.ts` | `getInstance()`, `loadInstruments(list)`, `getInstrumentFilePathsFromSymbol(sym)`, `getInstrumentNameFromSymbol(sym)`, `isInitialized` |
| `src/renderer/features/instruments/facade/instrument-facade.ts` | `getInstrumentNameFromSymbol(sym)`, `getInstrumentFilePathsFromSymbol(sym)` |
| `src/renderer/features/pattern/hooks/usePatternSession.ts` | hook → `{ pattern, changeSentence, addSentence, removeSentence, mutedSteps, toggleMute, isMuted, sentencesForPlayback }` |
| `src/renderer/features/pattern/hooks/usePattern.tsx` | hook → `{ pattern, changeSentence, addSentence, removeSentence, changeHighlight }` |
| `src/renderer/features/pattern/utils/pattern-parser.ts` | `createStep()`, `createGroup()`, `parseSteps()`, `countSentenceSteps()`, `normalizeSentences()`, `parseMultiTrackSteps()`, `flatTokenCount()` |
| `src/renderer/features/pattern/utils/pattern-mute.ts` | `transformSentencesWithMute(sentences, mutedSteps)` |
| `src/renderer/features/pattern/utils/pattern-validator.ts` | `validatePattern(fields)` — validation de formulaire (nom, phrases) |
| `src/renderer/features/pattern/components/PatternWorkspace.tsx` | Composant principal du studio |

### Duplication de code existante — le regex SENTENCE_REGEX

Le regex `\(([^)]*)\)|(\S+)/g` et sa logique de boucle `execAll` sont copiés dans **3 fichiers** :

1. **`pattern-parser.ts:4-14`** — `SENTENCE_REGEX` + `execAll()`
2. **`pattern-mute.ts:7,11-33`** — regex inline + while loop
3. **`sequence-service.ts:42-49`** — regex inline + while loop

La nouvelle fonction `areAllSymbolsValid()` en ferait une 4e copie.

### Types partagés existants

```typescript
// src/shared/types/instrument.ts
export type InstrumentName = string | null;
export type InstrumentFilePath = { name: InstrumentName; filepath: string | null; };

// src/shared/types/audio-file-buffer.ts
type AudioFileBuffer = Record<string, ArrayBuffer>;

// src/renderer/features/sequence/types/sequence-note.ts
export type SequenceNote = string | null;
export type SequenceNotes = SequenceNote | SequenceNote[];
```

---

## Architecture cible

```
PatternWorkspace
  │ (inchangé) usePatternSession() → sentencesForPlayback
  │ (inchangé) useAudio() → { playing, updateTrack, ... }
  │ (NOUVEAU) useMemo → allValid = areAllSymbolsValid(sentencesForPlayback, validSymbols)
  │ (NOUVEAU) useEffect → if playing && allValid → updateTrack(sentencesForPlayback)
  ▼
AudioContext.updateTrack(sentences)
  ▼
audio-facade.updatePattern(sentences)
  ├── extractUniqueSymbols(sentences) → string[] (via sentence-tokenizer)
  ├── Filtrer les symboles NON déjà chargés dans AudioEngine
  ├── Si nouveaux → IPC get-audio-buffers → audioEngine.addToPlayers()
  ├── preparePattern(sentence) → SequenceNotes[] (via sentence-tokenizer)
  └── audioEngine.updateSequences(allNotes)
        ├── Guard: si this.sequences.length === 0 → return (race condition)
        ├── Ajout/suppression de Tone.Sequence si nombre de pistes changé
        ├── seq.events = newNotes pour chaque Tone.Sequence existant
        └── Recrée Tone.Loop (step) si columnCount a changé
```

### Flux de données complet

```
1. User tape dans SentenceInput
2. changeSentence() → met à jour pattern.sentences dans le state React
3. useMemo → sentencesForPlayback = transformSentencesWithMute(sentences, mutedSteps)
4. useMemo → allValid = areAllSymbolsValid(sentencesForPlayback, validSymbols)
5. useEffect → si playing && allValid :
   a. extractUniqueSymbols(sentencesForPlayback) — extrait les symboles uniques (simple replace+split)
   b. Nouveaux symboles = filter(s => s !== '.' && !audioEngine.hasSymbol(s))
   c. Si nouveaux :
      - getInstrumentFilePathsFromSymbol(s) pour chaque nouveau
      - IPC 'get-audio-buffers' → AudioFileBuffer
      - audioEngine.addToPlayers(buffers) — decode + add dans Tone.Players
      - audioEngine.registerSymbol(s) pour chaque nouveau
   d. preparePattern(sentence) pour chaque phrase → SequenceNotes[][]
   e. audioEngine.updateSequences(allNotes) — mise à jour in-place
```

---

## Phase 0 — Déduplication du tokenizer (pré-requis)

### Nouveau fichier : `src/renderer/utils/sentence-tokenizer.ts`

```typescript
const SENTENCE_REGEX = /\(([^)]*)\)|(\S+)/g;

export interface TokenMatch {
  group: string | undefined;
  symbol: string | undefined;
  fullMatch: string;
}

export function tokenizeSentence(sentence: string): TokenMatch[] {
  const regex = new RegExp(SENTENCE_REGEX.source, SENTENCE_REGEX.flags);
  const matches: TokenMatch[] = [];
  let match = regex.exec(sentence);
  while (match !== null) {
    matches.push({
      group: match[1] !== undefined ? match[1] : undefined,
      symbol: match[2],
      fullMatch: match[0],
    });
    match = regex.exec(sentence);
  }
  return matches;
}

export function extractSymbols(sentence: string): string[] {
  const symbols: string[] = [];
  const tokens = tokenizeSentence(sentence);
  tokens.forEach((token) => {
    if (token.group !== undefined) {
      token.group.split(/\s+/).forEach((s) => symbols.push(s));
    } else if (token.symbol !== undefined) {
      symbols.push(token.symbol);
    }
  });
  return symbols;
}

export function extractUniqueSymbols(sentences: string[]): string[] {
  const all: string[] = [];
  sentences.forEach((s) => extractSymbols(s).forEach((sym) => all.push(sym)));
  return [...new Set(all)];
}
```

### Modification de `pattern-parser.ts`

- Supprimer `const SENTENCE_REGEX` (ligne 4)
- Supprimer `function execAll()` (lignes 7-14)
- Importer `tokenizeSentence` depuis le tokenizer
- Remplacer tous les appels à `execAll()` par `tokenizeSentence()` (le type de retour change légèrement : `RegExpExecArray[]` → `TokenMatch[]`)

La fonction `execAll` retourne `RegExpExecArray[]`. `TokenMatch[]` a la même structure logique (`group` = `match[1]`, `symbol` = `match[2]`). Les consommateurs de `execAll` sont :

```typescript
// parseSteps — ligne 52
return execAll(sentence).map((match, counter) => {
  if (match[1] !== undefined) return createGroup(match[1], validSymbols, counter);
  return createStep(match[2], validSymbols, counter);
});
```

Devient :

```typescript
return tokenizeSentence(sentence).map((token, counter) => {
  if (token.group !== undefined) return createGroup(token.group, validSymbols, counter);
  return createStep(token.symbol ?? '', validSymbols, counter);
});
```

```typescript
// countSentenceSteps — ligne 103
return execAll(sentence).length;
```

Devient :

```typescript
return tokenizeSentence(sentence).length;
```

### Modification de `pattern-mute.ts`

- Supprimer `const regex = /\(([^)]*)\)|(\S+)/g;` (ligne 7)
- Supprimer la boucle while inline (lignes 11-33)
- Importer `tokenizeSentence` depuis le tokenizer
- Réécrire `transformSentencesWithMute` pour utiliser `tokenizeSentence`

La boucle actuelle dans `transformSentencesWithMute` :
```typescript
return sentences.map((sentence, sentenceIndex) => {
  const parts: string[] = [];
  let match = regex.exec(sentence);
  let tokenIndex = 0;
  while (match !== null) {
    if (match[1] !== undefined) { /* groupe */ }
    else { /* symbole simple */ }
    match = regex.exec(sentence);
  }
  return parts.join(' ');
});
```

Devient utilisant `tokenizeSentence` :
```typescript
return sentences.map((sentence, sentenceIndex) => {
  const tokens = tokenizeSentence(sentence);
  const parts: string[] = [];
  let tokenIndex = 0;
  tokens.forEach((token) => {
    if (token.group !== undefined) {
      const symbols = token.group.trim().split(/\s+/);
      const transformed: string[] = [];
      symbols.forEach((sym) => {
        const key = `${sentenceIndex}-${tokenIndex}`;
        tokenIndex += 1;
        transformed.push(mutedSteps.has(key) ? '.' : sym);
      });
      parts.push(`(${transformed.join(' ')})`);
    } else {
      const key = `${sentenceIndex}-${tokenIndex}`;
      tokenIndex += 1;
      parts.push(mutedSteps.has(key) ? '.' : (token.symbol ?? ''));
    }
  });
  return parts.join(' ');
});
```

### Modification de `sequence-service.ts`

- Supprimer la boucle while inline (lignes 42-49)
- Importer `tokenizeSentence` depuis le tokenizer
- Réécrire `preparePattern` pour itérer sur `tokenizeSentence(sentence)` au lieu de la boucle regex

```typescript
// AVANT
export async function preparePattern(sentence: string): Promise<SequenceNotes[]> {
  const regex = /\(([^)]*)\)|(\S+)/g;
  const matches: RegExpExecArray[] = [];
  let match: RegExpExecArray | null = regex.exec(sentence);
  while (match !== null) {
    matches.push(match);
    match = regex.exec(sentence);
  }
  return Promise.all(matches.map(toSequenceNotes));
}

async function toSequenceNotes(match: RegExpExecArray): Promise<SequenceNotes> {
  if (match[1] !== undefined) return toGroupNotes(match[1]);
  return toSequenceNote(await getInstrumentNameFromSymbol(match[2]));
}
```

```typescript
// APRÈS
export async function preparePattern(sentence: string): Promise<SequenceNotes[]> {
  const tokens = tokenizeSentence(sentence);
  return Promise.all(tokens.map(toSequenceNotes));
}

async function toSequenceNotes(token: TokenMatch): Promise<SequenceNotes> {
  if (token.group !== undefined) return toGroupNotes(token.group);
  return toSequenceNote(await getInstrumentNameFromSymbol(token.symbol ?? ''));
}
```

### Tests de régression phase 0

**TOUS les tests existants doivent continuer à passer sans modification.** Vérifier avec `npm run test` après avoir fait les changements.

---

## Phase 1 — `InstrumentEngine.getAllSymbols()`

### Fichier : `src/renderer/features/instruments/engine/instrument-engine.ts`

Ajouter la méthode publique :

```typescript
public getAllSymbols(): string[] {
  return this.instruments.map((i) => i.symbol);
}
```

### Tests : `src/renderer/features/instruments/tests/instrument-engine.test.ts`

Ajouter un bloc `describe('#getAllSymbols')` :

```typescript
describe('#getAllSymbols', () => {
  let engine: InstrumentEngine;

  beforeEach(() => {
    InstrumentEngine['#instance'] = undefined as unknown as InstrumentEngine;
    engine = InstrumentEngine.getInstance();
  });

  it('should return an empty array when no instruments are loaded', () => {
    // Given: un moteur non initialisé
    // When: getAllSymbols()
    // Then: []
    expect(engine.getAllSymbols()).toEqual([]);
  });

  it('should return all symbols from loaded instruments', () => {
    // Given
    const instruments: Instrument[] = [
      { id: 1, slug: 'kickdrum', symbol: 'P', name: 'kickdrum', filepath: '/path/kickdrum.mp3' },
      { id: 2, slug: 'hihat', symbol: 'Ts', name: 'hihat', filepath: '/path/hihat.mp3' },
      { id: 3, slug: 'silence', symbol: '.', name: null, filepath: null },
    ];
    engine.loadInstruments(instruments);
    // When
    const result = engine.getAllSymbols();
    // Then
    expect(result).toEqual(['P', 'Ts', '.']);
  });

  it('should reflect changes after reloading instruments', () => {
    // Given
    engine.loadInstruments([
      { id: 1, slug: 'kickdrum', symbol: 'P', name: 'kickdrum', filepath: '/path/kickdrum.mp3' },
    ]);
    // When
    engine.loadInstruments([
      { id: 1, slug: 'kickdrum', symbol: 'P', name: 'kickdrum', filepath: '/path/kickdrum.mp3' },
      { id: 2, slug: 'hihat', symbol: 'Ts', name: 'hihat', filepath: '/path/hihat.mp3' },
    ]);
    // Then
    expect(engine.getAllSymbols()).toHaveLength(2);
  });
});
```

---

## Phase 2 — `areAllSymbolsValid()`

### Fichier : `src/renderer/features/pattern/utils/pattern-validator.ts`

**Ne pas créer de nouveau fichier** — ajouter la fonction dans le fichier existant. Il contient déjà `validatePattern()` (validation de formulaire). La nouvelle fonction est une validation différente (symboles vs instruments), mais elle appartient au même domaine.

```typescript
export function areAllSymbolsValid(
  sentences: string[],
  validSymbols: string[],
): boolean {
  const symbols = sentences
    .join(' ')
    .replace(/[()]/g, '')
    .split(/\s+/)
    .filter((s) => s.length > 0);
  if (symbols.length === 0) return true;
  return symbols.every((s) => s === '.' || validSymbols.includes(s));
}
```

**Note d'implémentation** : on utilise `replace(/[()]/g, '')` + `split` plutôt que le regex complet. C'est O(n) avec n = longueur totale des phrases, sans capture de groupes. Le silence `.` est toujours valide.

### Tests : `src/renderer/features/pattern/tests/pattern-validator.test.ts`

Ajouter un bloc `describe('#areAllSymbolsValid')` :

```typescript
describe('#areAllSymbolsValid', () => {
  const VALID_SYMBOLS = ['P', 'Ts', 'K', 'Bw', 'Pf'];

  it('should return true when all symbols are valid', () => {
    // Given
    const sentences = ['P (Ts K) .'];
    // When
    const result = areAllSymbolsValid(sentences, VALID_SYMBOLS);
    // Then
    expect(result).toBe(true);
  });

  it('should return false when a symbol is unknown', () => {
    // Given
    const sentences = ['P X Ts'];
    // When
    const result = areAllSymbolsValid(sentences, VALID_SYMBOLS);
    // Then
    expect(result).toBe(false);
  });

  it('should return false when a symbol inside a group is unknown', () => {
    // Given
    const sentences = ['P (Ts X) K'];
    // When
    const result = areAllSymbolsValid(sentences, VALID_SYMBOLS);
    // Then
    expect(result).toBe(false);
  });

  it('should treat silence (.) as always valid', () => {
    // Given
    const sentences = ['. . .'];
    // When
    const result = areAllSymbolsValid(sentences, []);
    // Then
    expect(result).toBe(true);
  });

  it('should return true for an empty sentence', () => {
    // Given
    const sentences = [''];
    // When
    const result = areAllSymbolsValid(sentences, VALID_SYMBOLS);
    // Then
    expect(result).toBe(true);
  });

  it('should return true for empty sentences array', () => {
    // Given
    const sentences: string[] = [];
    // When
    const result = areAllSymbolsValid(sentences, VALID_SYMBOLS);
    // Then
    expect(result).toBe(true);
  });

  it('should return false if only the first sentence is invalid', () => {
    // Given
    const sentences = ['X K .', 'P Ts K'];
    // When
    const result = areAllSymbolsValid(sentences, VALID_SYMBOLS);
    // Then
    expect(result).toBe(false);
  });

  it('should return false if only the second sentence is invalid', () => {
    // Given
    const sentences = ['P Ts K', 'P X K'];
    // When
    const result = areAllSymbolsValid(sentences, VALID_SYMBOLS);
    // Then
    expect(result).toBe(false);
  });

  it('should handle sentences with multiple groups', () => {
    // Given
    const sentences = ['(P Ts) (K Bw) Pf'];
    // When
    const result = areAllSymbolsValid(sentences, VALID_SYMBOLS);
    // Then
    expect(result).toBe(true);
  });

  it('should handle whitespace-only sentence', () => {
    // Given
    const sentences = ['   '];
    // When
    const result = areAllSymbolsValid(sentences, VALID_SYMBOLS);
    // Then
    expect(result).toBe(true);
  });
});
```

---

## Phase 3 — `sentence-tokenizer.test.ts`

### Nouveau fichier de test : `src/renderer/utils/sentence-tokenizer.test.ts`

Tests pour les 3 fonctions exportées :

```typescript
describe('#tokenizeSentence', () => {
  it('should return empty array for empty string', () => {
    // Given: ""
    // When
    const result = tokenizeSentence('');
    // Then
    expect(result).toEqual([]);
  });

  it('should tokenize a simple sentence with single symbols', () => {
    // Given: "P Ts K"
    const result = tokenizeSentence('P Ts K');
    // Then
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ group: undefined, symbol: 'P', fullMatch: 'P' });
    expect(result[1]).toEqual({ group: undefined, symbol: 'Ts', fullMatch: 'Ts' });
    expect(result[2]).toEqual({ group: undefined, symbol: 'K', fullMatch: 'K' });
  });

  it('should tokenize a sentence with a group', () => {
    // Given: "P (Ts K) ."
    const result = tokenizeSentence('P (Ts K) .');
    // Then
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ group: undefined, symbol: 'P', fullMatch: 'P' });
    expect(result[1]).toEqual({ group: 'Ts K', symbol: undefined, fullMatch: '(Ts K)' });
    expect(result[2]).toEqual({ group: undefined, symbol: '.', fullMatch: '.' });
  });

  it('should tokenize a sentence with multiple groups', () => {
    // Given: "(P Ts) K (. Bw)"
    const result = tokenizeSentence('(P Ts) K (. Bw)');
    // Then
    expect(result).toHaveLength(3);
    expect(result[0].group).toBe('P Ts');
    expect(result[1].symbol).toBe('K');
    expect(result[2].group).toBe('. Bw');
  });
});

describe('#extractSymbols', () => {
  it('should return empty array for empty string', () => {
    // Given: ""
    // When
    const result = extractSymbols('');
    // Then
    expect(result).toEqual([]);
  });

  it('should extract symbols from a simple sentence', () => {
    // Given: "P Ts K"
    // When
    const result = extractSymbols('P Ts K');
    // Then
    expect(result).toEqual(['P', 'Ts', 'K']);
  });

  it('should extract symbols from inside groups', () => {
    // Given: "P (Ts K) ."
    // When
    const result = extractSymbols('P (Ts K) .');
    // Then
    expect(result).toEqual(['P', 'Ts', 'K', '.']);
  });
});

describe('#extractUniqueSymbols', () => {
  it('should return empty array for empty sentences', () => {
    // Given: []
    // When
    const result = extractUniqueSymbols([]);
    // Then
    expect(result).toEqual([]);
  });

  it('should deduplicate symbols across sentences', () => {
    // Given: ["P Ts", "K P"]
    // When
    const result = extractUniqueSymbols(['P Ts', 'K P']);
    // Then
    expect(result).toHaveLength(3);
    expect(result).toContain('P');
    expect(result).toContain('Ts');
    expect(result).toContain('K');
  });

  it('should extract symbols from groups', () => {
    // Given: ["(Ts P) K"]
    // When
    const result = extractUniqueSymbols(['(Ts P) K']);
    // Then
    expect(result).toContain('Ts');
    expect(result).toContain('P');
    expect(result).toContain('K');
  });

  it('should handle multiple sentences with groups', () => {
    // Given: ["P (Ts K)", "(. Bw) Pf"]
    // When
    const result = extractUniqueSymbols(['P (Ts K)', '(. Bw) Pf']);
    // Then
    expect(result).toContain('P');
    expect(result).toContain('Ts');
    expect(result).toContain('K');
    expect(result).toContain('.');
    expect(result).toContain('Bw');
    expect(result).toContain('Pf');
  });
});
```

---

## Phase 4 — `AudioEngine` nouvelles méthodes

### Fichier : `src/renderer/features/audio/engine/audio-engine.ts`

Ajouter les champs et méthodes suivants. Ne pas modifier les méthodes existantes.

#### Nouveau champ privé

```typescript
private loadedSymbols: Set<string> = new Set();
private currentColumnCount: number = 0;
```

#### Méthodes à ajouter

```typescript
public hasSymbol(symbol: string): boolean {
  return this.loadedSymbols.has(symbol);
}

public registerSymbol(symbol: string): void {
  this.loadedSymbols.add(symbol);
}

public async addToPlayers(
  audioBuffers: AudioFileBuffer,
): Promise<void> {
  if (!this.players) return;
  const context = Tone.getContext();
  const buffers = Object.entries(audioBuffers);
  const decoded = await Promise.all(
    buffers.map(([, buffer]) =>
      context.decodeAudioData(buffer as ArrayBuffer),
    ),
  );
  buffers.forEach(([instrumentName], index) => {
    this.players!.add(instrumentName, decoded[index]);
  });
}

public updateSequences(tracks: SequenceNotes[][]): void {
  if (this.sequences.length === 0) return;

  while (this.sequences.length < tracks.length) {
    const seq = new Tone.Sequence(
      (time, note) => {
        if (this.players && note) {
          this.players.player(note).start(time);
        }
      },
      tracks[this.sequences.length],
      '8n',
    );
    seq.start(0);
    this.sequences.push(seq);
  }

  while (this.sequences.length > tracks.length) {
    const removed = this.sequences.pop();
    removed?.dispose();
  }

  tracks.forEach((notes, index) => {
    if (index < this.sequences.length) {
      this.sequences[index].events = notes;
    }
  });

  const newColumnCount = tracks[0]?.length ?? 0;
  if (newColumnCount !== this.currentColumnCount) {
    this.clearStepLoop();
    this.currentColumnCount = newColumnCount;
    this.createStepLoop(newColumnCount);
  }
}
```

#### Modification de `createPlayers` — marquer les symboles comme chargés

À la fin de `createPlayers`, après le `this.players.toDestination()`, ajouter la logique pour peupler `loadedSymbols`. Mais `createPlayers` reçoit `AudioFileBuffer` (clé = nom d'instrument, pas symbole). Il faut passer les symboles ou faire le mapping ailleurs.

**Décision d'implémentation** : le marquage des symboles chargés se fera dans la facade `updatePattern()`, pas dans `createPlayers`. C'est la facade qui a accès aux symboles. `createPlayers` ne change pas (sauf pour resetter `loadedSymbols` au début).

#### Modification de `createSequence` — stocker le columnCount

Dans `createSequence`, après `this.createStepLoop(tracks[0].length)` :

```typescript
this.currentColumnCount = tracks[0]?.length ?? 0;
```

#### Modification de `clearAll` — resetter le columnCount

```typescript
private clearAll(): void {
  this.clearSequences();
  this.clearStepLoop();
  this.currentColumnCount = 0;
}
```

### Tests : nouveau fichier `src/renderer/features/audio/tests/audio-engine.test.ts`

Les tests de `AudioEngine` nécessitent de mocker Tone.js. Utiliser le pattern de mock inline comme dans les tests existants.

```typescript
// Mocks
jest.mock('tone', () => {
  const mockSequence = {
    events: [],
    start: jest.fn(),
    dispose: jest.fn(),
  };
  const mockPlayers = {
    add: jest.fn(),
    player: jest.fn().mockReturnValue({ start: jest.fn() }),
    toDestination: jest.fn(),
    dispose: jest.fn(),
  };
  const mockLoop = {
    start: jest.fn(),
    dispose: jest.fn(),
  };
  return {
    default: undefined,
    __esModule: true,
    Sequence: jest.fn().mockImplementation(() => mockSequence),
    Players: jest.fn().mockImplementation(() => mockPlayers),
    Loop: jest.fn().mockImplementation(() => mockLoop),
    getContext: jest.fn().mockReturnValue({
      decodeAudioData: jest.fn().mockResolvedValue({}),
    }),
    getTransport: jest.fn().mockReturnValue({}),
  };
});
```

#### `#hasSymbol`

```typescript
describe('#hasSymbol', () => {
  let engine: AudioEngine;

  beforeEach(() => {
    AudioEngine['#instance'] = undefined as unknown as AudioEngine;
    engine = AudioEngine.getInstance();
  });

  it('should return false when no symbols have been registered', () => {
    // Given: un moteur avec loadedSymbols vide
    // When: hasSymbol("P")
    // Then: false
    expect(engine.hasSymbol('P')).toBe(false);
  });

  it('should return false for an unregistered symbol', () => {
    // Given
    engine.registerSymbol('P');
    // When
    const result = engine.hasSymbol('Ts');
    // Then
    expect(result).toBe(false);
  });
});
```

#### `#registerSymbol`

```typescript
describe('#registerSymbol', () => {
  let engine: AudioEngine;

  beforeEach(() => {
    AudioEngine['#instance'] = undefined as unknown as AudioEngine;
    engine = AudioEngine.getInstance();
  });

  it('should register a new symbol', () => {
    // Given
    // When
    engine.registerSymbol('Bw');
    // Then
    expect(engine.hasSymbol('Bw')).toBe(true);
  });

  it('should be idempotent', () => {
    // Given
    engine.registerSymbol('P');
    // When
    engine.registerSymbol('P');
    // Then
    expect(engine.hasSymbol('P')).toBe(true);
  });

  it('should register the silence symbol', () => {
    // Given
    // When
    engine.registerSymbol('.');
    // Then
    expect(engine.hasSymbol('.')).toBe(true);
  });
});
```

#### `#updateSequences`

```typescript
describe('#updateSequences', () => {
  let engine: AudioEngine;
  let mockSeq: { events: unknown; dispose: jest.Mock };

  beforeEach(() => {
    AudioEngine['#instance'] = undefined as unknown as AudioEngine;
    engine = AudioEngine.getInstance();
    mockSeq = { events: [], dispose: jest.fn() };
    jest.mocked(Tone.Sequence).mockImplementation(() => mockSeq as unknown as Tone.Sequence);
  });

  it('should do nothing when no sequences exist (race condition guard)', () => {
    // Given: engine sans aucune séquence
    // When
    engine.updateSequences([['kickdrum']]);
    // Then
    expect(Tone.Sequence).not.toHaveBeenCalled();
  });

  it('should update events on existing sequence without creating new ones', () => {
    // Given: 1 sequence déjà créée
    engine.createSequence([['kickdrum', 'hihat']]);
    jest.mocked(Tone.Sequence).mockClear();
    // When
    engine.updateSequences([['kickdrum', null, 'hihat']]);
    // Then: events mis à jour, pas de nouvelle séquence
    expect(mockSeq.events).toEqual(['kickdrum', null, 'hihat']);
    expect(Tone.Sequence).not.toHaveBeenCalled();
  });

  it('should create a new sequence when track count increases', () => {
    // Given: 1 sequence déjà créée
    engine.createSequence([['kickdrum']]);
    jest.mocked(Tone.Sequence).mockClear();
    // When: 2 pistes
    engine.updateSequences([['kickdrum'], ['hihat']]);
    // Then: 1 nouvelle séquence créée (pour la 2e piste)
    expect(Tone.Sequence).toHaveBeenCalledTimes(1);
  });

  it('should dispose extra sequences when track count decreases', () => {
    // Given: 2 sequences
    engine.createSequence([['kickdrum'], ['hihat']]);
    // When: 1 piste
    engine.updateSequences([['kickdrum']]);
    // Then: une séquence disposée
    expect(mockSeq.dispose).toHaveBeenCalled();
  });
});
```

---

## Phase 5 — `updatePattern()` dans la facade audio

### Fichier : `src/renderer/features/audio/facade/audio-facade.ts`

Ajouter les imports nécessaires et la fonction :

```typescript
import { extractUniqueSymbols } from '../../../utils/sentence-tokenizer';

export async function updatePattern(sentences: string[]): Promise<void> {
  const audioEngine = AudioEngine.getInstance();

  const uniqueSymbols = extractUniqueSymbols(sentences);
  const newSymbols = uniqueSymbols.filter(
    (s) => s !== '.' && !audioEngine.hasSymbol(s),
  );

  if (newSymbols.length > 0) {
    const filePaths = (
      await Promise.all(
        newSymbols.map((s) => getInstrumentFilePathsFromSymbol(s)),
      )
    ).flat();
    const audioBuffers = await getAudioBuffers(filePaths);
    await audioEngine.addToPlayers(audioBuffers);
    newSymbols.forEach((s) => audioEngine.registerSymbol(s));
  }

  const allNotes: SequenceNotes[][] = await Promise.all(
    sentences.map((sentence) => preparePattern(sentence)),
  );

  audioEngine.updateSequences(allNotes);
}
```

### Tests : nouveau fichier `src/renderer/features/audio/tests/audio-facade.test.ts`

```typescript
describe('#updatePattern', () => {
  let mockEngine: {
    hasSymbol: jest.Mock;
    registerSymbol: jest.Mock;
    addToPlayers: jest.Mock;
    updateSequences: jest.Mock;
  };

  beforeEach(() => {
    mockEngine = {
      hasSymbol: jest.fn().mockReturnValue(true),
      registerSymbol: jest.fn(),
      addToPlayers: jest.fn().mockResolvedValue(undefined),
      updateSequences: jest.fn(),
    };
    jest.spyOn(AudioEngine, 'getInstance').mockReturnValue(mockEngine as unknown as AudioEngine);
    jest.spyOn(instrumentFacade, 'getInstrumentFilePathsFromSymbol')
      .mockImplementation(async (s: string) => {
        const map: Record<string, InstrumentFilePath[]> = {
          P: [{ name: 'kickdrum', filepath: '/path/kickdrum.mp3' }],
          Ts: [{ name: 'hihat', filepath: '/path/hihat.mp3' }],
          K: [{ name: 'rimshot', filepath: '/path/rimshot.mp3' }],
          Bw: [{ name: 'liproll', filepath: '/path/liproll.mp3' }],
          '.': [{ name: null, filepath: null }],
        };
        if (!map[s]) throw new Error(`Le symbole ${s} n'existe pas.`);
        return map[s];
      });
    jest.spyOn(audioService, 'default').mockResolvedValue({});
  });

  it('should update sequences without loading if no new symbols', async () => {
    // Given: engine a déjà P, Ts, K chargés (hasSymbol → true)
    mockEngine.hasSymbol.mockReturnValue(true);
    // When
    await updatePattern(['P (Ts K) .']);
    // Then
    expect(mockEngine.addToPlayers).not.toHaveBeenCalled();
    expect(mockEngine.registerSymbol).not.toHaveBeenCalled();
    expect(mockEngine.updateSequences).toHaveBeenCalledTimes(1);
  });

  it('should load new audio buffer when a new valid symbol appears', async () => {
    // Given: engine a P, Ts chargés. Bw est nouveau
    mockEngine.hasSymbol.mockImplementation((s: string) => s === 'P' || s === 'Ts');
    // When
    await updatePattern(['P (Ts Bw)']);
    // Then
    expect(instrumentFacade.getInstrumentFilePathsFromSymbol).toHaveBeenCalledWith('Bw');
    expect(audioService.default).toHaveBeenCalledTimes(1);
    expect(mockEngine.addToPlayers).toHaveBeenCalledTimes(1);
    expect(mockEngine.registerSymbol).toHaveBeenCalledWith('Bw');
    expect(mockEngine.updateSequences).toHaveBeenCalledTimes(1);
  });

  it('should skip . (silence) when checking for new symbols', async () => {
    // Given: engine a P chargé
    mockEngine.hasSymbol.mockImplementation((s: string) => s === 'P');
    // When
    await updatePattern(['P . . .']);
    // Then
    expect(mockEngine.addToPlayers).not.toHaveBeenCalled();
    expect(mockEngine.updateSequences).toHaveBeenCalledTimes(1);
  });

  it('should register new symbols after successful loading', async () => {
    // Given
    mockEngine.hasSymbol.mockReturnValue(false);
    // When
    await updatePattern(['Bw']);
    // Then
    expect(mockEngine.registerSymbol).toHaveBeenCalledWith('Bw');
    expect(mockEngine.updateSequences).toHaveBeenCalledTimes(1);
  });
});
```

---

## Phase 6 — `AudioContext.updateTrack()`

### Fichier : `src/renderer/features/audio/contexts/AudioContext.tsx`

Ajouter dans le type `AudioContextType` :

```typescript
updateTrack: (sentences: string[]) => Promise<void>;
```

Ajouter dans le `useMemo` :

```typescript
updateTrack: async (sentences: string[]): Promise<void> => {
  try {
    await updatePattern(sentences);
  } catch (error) {
    // Silencieux — l'édition reste réactive, l'audio reprendra au prochain update valide
  }
},
```

Ajouter l'import de `updatePattern` :

```typescript
import {
  playPattern,
  stopPattern,
  changeTempo,
  playInstrument,
  updatePattern,
} from '../facade/audio-facade';
```

**Pas de tests** — c'est un composant React context, hors scope métier.

### Fichier : `src/renderer/features/audio/hooks/useAudio.tsx`

Exposer `updateTrack` dans le type de retour (il est déjà dans `AudioContextType`, donc `useAudio()` le retourne automatiquement — rien à changer).

---

## Phase 7 — Intégration dans `PatternWorkspace`

### Fichier : `src/renderer/features/pattern/components/PatternWorkspace.tsx`

#### Nouveaux imports

```typescript
import { useEffect, useMemo } from 'react'; // ajouter useMemo
import { useInstrumentsContext } from '../../instruments/contexts/InstrumentsContext'; // ou le bon import
import { areAllSymbolsValid } from '../utils/pattern-validator';
```

#### Accès aux instruments

Le `PatternWorkspace` doit connaître la liste des symboles valides. Il y a deux options :

**Option A** : Utiliser `useInstrumentsContext()` si disponible au niveau du `PatternWorkspace`.
**Option B** : Charger les symboles via `InstrumentEngine.getInstance().getAllSymbols()`.

Vérifier si `PatternWorkspace` a accès au `InstrumentsProvider`. Oui — le provider est au-dessus dans `App.tsx`.

**Code à ajouter dans le composant** :

```typescript
const { instruments } = useInstrumentsContext();
const validSymbols = useMemo(
  () => instruments.map((i) => i.symbol),
  [instruments],
);

const allValid = useMemo(
  () => areAllSymbolsValid(sentencesForPlayback, validSymbols),
  [sentencesForPlayback, validSymbols],
);
```

#### Nouveau `useEffect`

```typescript
const { playing, updateTrack } = useAudio(); // modifier la ligne 41 pour extraire updateTrack

// Mise à jour dynamique de la séquence pendant la lecture
useEffect(() => {
  if (playing && allValid) {
    updateTrack(sentencesForPlayback);
  }
}, [playing, allValid, sentencesForPlayback, updateTrack]);
```

**Pas de tests** — composant React.

---

## Phase 8 — Mise à jour de `createSequence` pour le chargement initial

### Fichier : `src/renderer/features/audio/engine/audio-engine.ts`

Dans `createSequence`, après avoir créé les séquences mais avant de retourner, enregistrer les colonnes :

```typescript
this.currentColumnCount = tracks[0]?.length ?? 0;
```

### Fichier : `src/renderer/features/audio/facade/audio-facade.ts`

Dans `playPattern` (ou `prepareAudioEngine`), après `createSequence`, enregistrer les symboles comme chargés :

```typescript
// Dans prepareAudioEngine, après createSequence(allNotes)
const allSymbols = extractUniqueSymbols(sentences);
allSymbols.forEach((s) => audioEngine.registerSymbol(s));
```

Ceci permet à `updatePattern` de savoir quels symboles sont déjà chargés quand l'utilisateur édite.

---

## Ordre d'implémentation (TDD)

1. **Phase 0** — Créer `sentence-tokenizer.ts` + `sentence-tokenizer.test.ts`, refactorer `pattern-parser.ts`, `pattern-mute.ts`, `sequence-service.ts`. Vérifier que TOUS les tests existants passent (`npm run test`).
2. **Phase 1** — `InstrumentEngine.getAllSymbols()` + tests dans `instrument-engine.test.ts`
3. **Phase 2** — `areAllSymbolsValid()` + tests dans `pattern-validator.test.ts`
4. **Phase 3** — Compléter `sentence-tokenizer.test.ts` si pas déjà fait en phase 0
5. **Phase 4** — `AudioEngine.hasSymbol()`, `registerSymbol()`, `addToPlayers()`, `updateSequences()` + `audio-engine.test.ts`
6. **Phase 5** — `audio-facade.updatePattern()` + `audio-facade.test.ts`
7. **Phase 6** — `AudioContext.updateTrack()` (pas de tests)
8. **Phase 7** — Intégration dans `PatternWorkspace` (pas de tests)
9. **Phase 8** — Enregistrement des symboles au Play initial

Lancer `npm run test` après chaque phase.

---

## Liste exhaustive des fichiers à créer

| Fichier | Action |
|---------|--------|
| `src/renderer/utils/sentence-tokenizer.ts` | Créer |
| `src/renderer/utils/sentence-tokenizer.test.ts` | Créer |
| `src/renderer/features/audio/tests/audio-engine.test.ts` | Créer |
| `src/renderer/features/audio/tests/audio-facade.test.ts` | Créer |

## Liste exhaustive des fichiers à modifier

| Fichier | Modification |
|---------|-------------|
| `src/renderer/features/instruments/engine/instrument-engine.ts` | + `getAllSymbols()` |
| `src/renderer/features/instruments/tests/instrument-engine.test.ts` | + describe `#getAllSymbols` |
| `src/renderer/features/pattern/utils/pattern-validator.ts` | + `areAllSymbolsValid()` |
| `src/renderer/features/pattern/tests/pattern-validator.test.ts` | + describe `#areAllSymbolsValid` |
| `src/renderer/features/pattern/utils/pattern-parser.ts` | Remplacer regex → import `tokenizeSentence` |
| `src/renderer/features/pattern/utils/pattern-mute.ts` | Remplacer regex → import `tokenizeSentence` |
| `src/renderer/features/sequence/service/sequence-service.ts` | Remplacer regex → import `tokenizeSentence` |
| `src/renderer/features/audio/engine/audio-engine.ts` | + `loadedSymbols`, `currentColumnCount`, `hasSymbol()`, `registerSymbol()`, `addToPlayers()`, `updateSequences()` |
| `src/renderer/features/audio/facade/audio-facade.ts` | + `updatePattern()`, enregistrement des symboles après `createSequence` |
| `src/renderer/features/audio/contexts/AudioContext.tsx` | + `updateTrack()` dans le contexte |
| `src/renderer/features/pattern/components/PatternWorkspace.tsx` | + `useEffect` + `useMemo` de validation + `updateTrack` |

## Fichiers qui ne nécessitent AUCUN changement

| Fichier | Raison |
|---------|--------|
| `src/main/icpEvents.ts` | Le channel IPC `get-audio-buffers` existe déjà |
| `src/main/preload.ts` | Aucun nouveau channel IPC nécessaire |
| `src/main/audio/services/audio-service.ts` | Déjà fonctionnel |
| `src/renderer/features/audio/services/audio-service.ts` | Déjà fonctionnel |
| `src/renderer/features/sequence/facade/sequence-facade.ts` | Délégue à `sequence-service.ts` |
| `src/renderer/features/sequence/adapters/sequence-adapter.ts` | Fonction identité, inchangée |
| `src/renderer/features/sequence/types/sequence-note.ts` | Types inchangés |
| `src/renderer/features/instruments/facade/instrument-facade.ts` | Les méthodes `getInstrumentNameFromSymbol` et `getInstrumentFilePathsFromSymbol` existent |
| `src/renderer/features/pattern/hooks/usePatternSession.ts` | Inchangé — `sentencesForPlayback` est déjà calculé |
| `src/renderer/features/pattern/hooks/usePattern.tsx` | Inchangé |
| `src/renderer/features/audio/components/AudioControls.tsx` | Inchangé |
| Tous les fichiers de `src/shared/` | Types existants suffisants |

---

## Cas limites et pièges

| Cas | Comportement attendu |
|-----|---------------------|
| `updateTrack` appelé avant que `playPattern` ait fini | `updateSequences` fait un early return (`sequences.length === 0`), sans erreur |
| User supprime un symbole pendant la lecture | La séquence est mise à jour immédiatement (le symbole supprimé disparaît du son) |
| User ajoute une piste pendant la lecture | `updateSequences` crée un nouveau `Tone.Sequence`, immédiatement actif |
| User supprime une piste pendant la lecture | `updateSequences` dispose le `Tone.Sequence` en trop |
| User change la 1ère phrase (normalisation) | Toutes les autres pistes sont normalisées → `areAllSymbolsValid` recalculé → update si valide |
| User toggle un mute pendant la lecture | `sentencesForPlayback` recalcule → `areAllSymbolsValid` (toujours true, car `.` est valide) → update |
| User ajoute un symbole valide + un invalide en même temps | `allValid` = false, aucun update. Quand l'invalide est corrigé, les DEUX changements sont appliqués |
| `InstrumentEngine` n'est pas encore initialisé | Les facades `getInstrumentNameFromSymbol` et `getInstrumentFilePathsFromSymbol` appellent `prepareInstrumentEngine()` en interne |
| `Tone.getContext().decodeAudioData()` échoue | L'erreur est attrapée dans `updatePattern`, silencieusement (pas d'alert bloquant) |
| `getInstrumentFilePathsFromSymbol` throw (symbole inconnu) | Ne peut pas arriver — on filtre avec `hasSymbol()` qui est géré en amont, et la validation bloque les symboles invalides avant cet appel |
| `this.players.add(name, decoded[index])` — Tone.js accepte des ajouts après la création initiale | Confirmé : `Tone.Players.add()` fonctionne dynamiquement |
| `seq.events = newNotes` pendant un temps très proche de la prochaine note | Tone.js `_part.clear()` + `_rescheduleSequence` sont synchrones dans le même tick JS. Pas de note perdue ou doublée |

## Avancement

- [x] Analyse du code existant (25/06/2026)
- [x] Vérification faisabilité Tone.Sequence.events setter — OK
- [x] Analyse d'architecture et optimisations
- [x] Plan de tests GWT exhaustif
- [ ] Phase 0 — Déduplication du tokenizer
- [ ] Phase 1 — `InstrumentEngine.getAllSymbols()`
- [ ] Phase 2 — `areAllSymbolsValid()`
- [ ] Phase 3 — `sentence-tokenizer.test.ts`
- [ ] Phase 4 — `AudioEngine` nouvelles méthodes
- [ ] Phase 5 — `audio-facade.updatePattern()`
- [ ] Phase 6 — `AudioContext.updateTrack()`
- [ ] Phase 7 — Intégration `PatternWorkspace`
- [ ] Phase 8 — Enregistrement symboles au Play initial

## Notes / décisions

- L'accumulation des changements valides derrière un invalide est implicite : le state React contient la dernière version des phrases, le gate ne fait que différer l'appel à `updatePattern`
- `updatePattern` charge les nouveaux buffers audio AVANT de mettre à jour les sequences, pour éviter un délai entre le reschedule et la disponibilité du son
- Pas besoin de debounce — chaque frappe valide pendant la lecture déclenche un update. Tone.js gère le reschedule sans glitch.
- Si la validation échoue → pas d'update audio → le nouveau symbole invalide est visible dans la grille (en rouge) mais pas joué
- `areAllSymbolsValid` utilise `replace(/[()]/g, '')` + `.split()` (O(n)) plutôt que le regex complet (O(n×m)) — optimisation délibérée
- Le tokenizer partagé (`sentence-tokenizer.ts`) est dans `src/renderer/utils/` car il est utilisé par plusieurs features (pattern, sequence)
- `hasSymbol` / `registerSymbol` dans `AudioEngine` trackent par symbole (ex: "P"), pas par nom d'instrument (ex: "kickdrum"). Le mapping symbole → nom est fait par `InstrumentEngine` dans la facade
