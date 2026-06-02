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
- Sauvegarde : IPC `save-recorded-audio` → main écrit dans `userData/recorded-audio/<slug>.wav`
- Création instrument : réutilisation du channel IPC `create-instrument` existant

### Flux utilisateur
1. Page `/recorder` → état `idle` → bouton "⏺ Enregistrer"
2. Clic → demande permission micro → état `recording` (cercle rouge + timer)
3. Clic "⏹ Arrêter" → arrêt micro, encodage WAV → état `recorded`
4. Pré-écoute avec "▶ Écouter"
5. Saisie symbole + nom → clic "💾 Enregistrer l'instrument"
6. Sauvegarde fichier + création instrument → redirection vers `/configuration/instruments`

### UI
- Layout : `content-page` + `workspace-section-content` (conforme au style existant)
- Boutons : `btn-primary`, `btn-secondary`
- Champs : `input-field`
- Animation : pulse rouge custom `@keyframes record-pulse`

### Fichiers à créer
- `src/renderer/features/recorder/models/recorder-model.ts`
- `src/renderer/features/recorder/services/recorder-service.ts`
- `src/renderer/features/recorder/utils/wav-encoder.ts`
- `src/renderer/features/recorder/hooks/useRecorder.ts`
- `src/renderer/features/recorder/components/RecorderScreen.tsx`

### Fichiers à modifier
- `src/main/preload.ts` : ajout channel `save-recorded-audio`
- `src/main/icpEvents.ts` : handler `save-recorded-audio`
- `src/renderer/App.tsx` : route `/recorder`
- `src/renderer/components/Header.tsx` : nav item position 3
- `src/renderer/components/Home.tsx` : lien home

## Avancement
- [ ] Specs validées

## Notes / décisions
- Encodage WAV plutôt que MP3 (pas de dépendance lamejs)
- ScriptProcessorNode (déprécié mais fonctionnel) plutôt qu'AudioWorklet (trop complexe pour ce besoin)
