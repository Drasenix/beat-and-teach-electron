# New Feature — Workflow

## Principe
Chaque nouvelle feature est documentée dans un fichier dédié sous `.agent/features/`.

## Cycle de vie
1. **Demande** → plan, discussion des specs
2. **Création** → fichier `.agent/features/<slug>.md` avec specs validées
3. **Go** → tu écris "go dev" dans le prompt → j'ajoute `GO` au fichier → j'implémente
4. **Stop** → tu écris "stop dev" → je retire `GO` → j'arrête l'implémentation
5. **Validation** → tu confirmes → je supprime le fichier

## Template `.agent/features/<feature-name>.md`
```markdown
# Feature: <nom>

## Specs
...

## Avancement
- [ ] ...

## Notes / décisions
...
```

## Règles
- Ne pas créer de fichier feature sans accord explicite
- Le fichier évolue avec les décisions prises en cours de route
- La suppression = validation acceptée par l'utilisateur

## Règles d'intervention (GO)
- **Sans `GO`** → je ne modifie que des fichiers `.md` (documentation).
  Si du code doit changer, je le propose et attends `GO`.
- **Avec `GO`** → j'ajoute `GO` au fichier feature → j'implémente normalement.
- **Dérogation** → si tu veux outrepaser l'absence de `GO`, tu le demandes
  explicitement dans ton prompt → je réponds par une question **OUI/NON**
  → si tu confirmes, j'exécute pour cette fois. Je ne propose pas d'ajouter
  `GO` au fichier.
