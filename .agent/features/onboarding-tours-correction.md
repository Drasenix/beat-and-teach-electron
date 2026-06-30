# Feature: Correction des tours guidés (onboarding)

## Specs

### ✅ P0 — Bugs bloquants (terminé)

- [x] **Studio tour : `onNextClick` bug** — refactoré avec `setSectionState()` qui lit l'état actuel avant de cliquer.
- [x] **Fallback pour sélecteurs vides** — helpers deviennent des no-ops si le DOM n'est pas prêt.
- [x] **Race condition `GuideContent.tsx`** — `localStorage` supprimé, `setTimeout(500)` remplacé par `waitForElement()`.
- [x] **Race condition `OnboardingDriver.tsx`** — idem.

### ✅ P1 — Robustesse (terminé)

- [x] **DRY : factory `createTour()` partagée** — `onboarding/utils/createTour.ts`.
- [ ] **Ajouter `data-tour` attributes** — non prioritaire, à faire au fil des corrections.

### ✅ P2 — Pédagogie et UX (terminé)

- [x] **Studio : réduit de 16 à 9 étapes**
- [x] **Réécriture des textes des popups (tous les tours)**
- [x] **Option A : Suppression du tour Patterns**
- [x] **Studio tour step 5 (Grille) — corriger le texte du mute (click → survol)**
- [x] **GuideContent.tsx — ajouter section "Édition des steps"**
- [x] **GuideShortcuts.tsx — compléter section "Outils" avec tooltip**

### ✅ P3 — Interactivité du tour (terminé)

- [x] ~~**StepBadge.tsx — support `data-tour-force-tooltip`**~~ (annulé : le tooltip du tour est hors overlay driver.js)
- [x] **Studio tour — étape overlay descriptive "Panneau d'édition"** (sans tooltip forcé)
- [x] **Studio tour — émojis + `—` remplacés par `<span class="text-primary font-bold">`**
- [x] **GuideContent.tsx / GuideShortcuts.tsx — émojis remplacés par icônes Lucide**

## Avancement

- [x] Specs validées
GO

## Notes / décisions

- Option A validée pour le tour Patterns (suppression).
- Approche `data-tour-force-tooltip` : `MutationObserver` dans StepBadge, `zIndex: 10000` pour passer devant overlay driver.js.
