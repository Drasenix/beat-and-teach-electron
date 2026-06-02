# New Feature — Workflow

## Principe
Chaque nouvelle feature est documentée dans un fichier dédié sous `.agent/features/`.

## Cycle de vie
1. **Demande** → je te présente un plan, on discute les specs
2. **Création** → un fichier `.agent/features/<slug>.md` est créé avec les specs validées
3. **Évolution** → la doc du fichier suit l'avancement de l'implémentation
4. **Validation** → quand tu déclares la feature validée, le fichier est supprimé

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
