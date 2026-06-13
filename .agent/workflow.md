# Workflow de développement — TDD cycle RGR

S'applique au **code métier uniquement** : parser, validator, mute, adapters, engine, service, utils (fonctions pures).

**Pas de TDD pour le frontend** : composants React, hooks UI, contexts — tests après ou pas de tests.

## Cycle

### 0. Specs
- Lire et comprendre la demande
- Questions/réponses avec l'utilisateur jusqu'à validation explicite des specs
- Aucune écriture de code avant validation

### 1. Given / When / Then
- Rédiger les cas de test en langage humain structuré
- Valider le plan de test avec l'utilisateur si nécessaire

```
Given: un instrument avec symbole "P" existe en base
When: on appelle getInstrumentNameFromSymbol("P")
Then: retourne "kickdrum"
```

### 2. RED
- Implémenter les tests unitaires (Jest, ts-jest)
- Vérifier qu'ils échouent (`npm run test` → rouge)
- Ne pas écrire de code métier à cette étape

### 3. Code
- Analyser le problème
- Implémenter la solution la plus simple possible
- Fonctions pures, immutabilité, pas de `for...of`, pas d'implicit `any`

### 4. GREEN
- Lancer `npm run test`
- Tous les tests passent → vert
- Si échec : corriger le code (retour étape 3)

### 5. Refacto
- Améliorer le code sans changer le comportement
- Extraire les fonctions pures, réduire la duplication, simplifier
- Lancer `npm run test` + `npm run lint` pour confirmer
