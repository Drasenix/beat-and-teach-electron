# Feature: recorder

## Specs

Nouvel écran permettant d'enregistrer un instrument directement depuis l'application via le microphone.

### Contexte
- Route : `/recorder`
- Icône nav : `⏺` (U+23FA), titre "Enregistreur"
- Position dans la sidebar : 3e (après Instruments, avant Patterns)
- Navigation : Header.tsx + Home.tsx

### Stack technique
- Capture : `getUserMedia` → `AudioContext` → `MediaStreamSource` → `ScriptProcessorNode`
- Format : WAV (PCM 16-bit mono), encodé côté rendu sans dépendance
- Sauvegarde : IPC `save-recorded-audio` → main écrit dans `userData/recorded-audio/<timestamp>.wav`
- Création instrument : **non gérée par le recorder** — l'utilisateur passe par l'écran Instruments
  (`/configuration/instruments`) via le formulaire existant + `open-file-dialog` (filtre déjà `.wav`)

### Flux utilisateur
1. Page `/recorder` → état `idle` → bouton "⏺ Enregistrer"
2. Clic → demande permission micro → état `recording` (cercle rouge + timer)
3. Clic "⏹ Arrêter" → arrêt micro → état `recorded`
4. **Waveform editor** apparaît : rendu canvas du signal audio avec deux curseurs de trim
5. L'utilisateur déplace les curseurs début/fin pour sélectionner la zone à conserver
6. Clic "Rogner" → génère un nouveau `Float32Array` avec la portion sélectionnée → pré-écoute
7. Clic "Sauvegarder" → encodage WAV du signal rogné → IPC `save-recorded-audio` → état `saved`
8. Clic "🗑 Effacer" ou "⏺ Nouvel enregistrement" pour recommencer
9. L'utilisateur va dans Instruments → "Ajouter un instrument" → sélectionne le fichier `.wav`
   dans `userData/recorded-audio/` via le dialogue natif

### Waveform editor
- **Rendu** : `<canvas>` remplissant la largeur du conteneur, hauteur fixe (ex: 160px)
- **Signal** : downsampling du `Float32Array` pour affichage (1 pixel = N samples), trait blanc sur fond field
- **Curseurs** : deux poignées verticales draggable (début = position 0, fin = position 100%)
- **Zone sélectionnée** : fond semi-transparent primary entre les deux curseurs
- **Bouton "Rogner"** : slice le `Float32Array` entre les indices début/fin, recrée un waveform affiché
- **Pré-écoute** : `<audio controls />` sur le signal rogné (URL.createObjectURL(Blob))
- Pas d'auto-détection des silences, pas de découpe milieu, pas de zoom

### UI
- Layout : `content-page` + `workspace-section-content` (conforme au style existant)
- Boutons : `btn-primary`, `btn-secondary`
- Animation : pulse rouge custom `@keyframes record-pulse`

### Fichiers à créer
- `src/renderer/features/recorder/models/recorder-model.ts`
- `src/renderer/features/recorder/services/recorder-service.ts`
- `src/renderer/features/recorder/utils/wav-encoder.ts`
- `src/renderer/features/recorder/utils/waveform-renderer.ts` — rendu canvas du waveform
- `src/renderer/features/recorder/hooks/useRecorder.ts`
- `src/renderer/features/recorder/hooks/useWaveformEditor.ts` — logique trim + curseurs
- `src/renderer/features/recorder/components/RecorderScreen.tsx`
- `src/renderer/features/recorder/components/WaveformEditor.tsx` — composant canvas + curseurs

### Fichiers à modifier
- `src/main/preload.ts` : ajout channel `save-recorded-audio`
- `src/main/icpEvents.ts` : handler `save-recorded-audio`
- `src/renderer/App.tsx` : route `/recorder`
- `src/renderer/components/Header.tsx` : nav item position 3
- `src/renderer/components/Home.tsx` : lien home

## Avancement
- [ ] Specs validées
- [x] Tests wav-encoder
- [ ] Tests waveform-renderer
- [ ] Tests useWaveformEditor
- [ ] Écran RecorderScreen + states
- [ ] WaveformEditor component
- [ ] IPC save-recorded-audio
- [ ] Navigation et route

## Notes / décisions
- Encodage WAV plutôt que MP3 (pas de dépendance lamejs)
- ScriptProcessorNode (déprécié mais fonctionnel) plutôt qu'AudioWorklet (trop complexe pour ce besoin)
- Trim manuel uniquement (pas d'auto-détection des silences) — l'utilisateur règle visuellement
- Pas de découpe multiple, pas de zoom — basique et efficace
