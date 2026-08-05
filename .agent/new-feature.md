# New Feature — Workflow

## Principe
Chaque nouvelle feature est documentée dans un fichier dédié sous `.agent/features/`.
Ce fichier est le **fil d'Ariane** : les étapes réalisées, les analyses et les décisions y sont consignées par les subagents du pipeline (voir `feature-workflow.md`).

## Cycle de vie — pipeline 7 étapes

1. **Demande** → plan, discussion des specs
2. **Création** → fichier `.agent/features/<slug>.md` (template ci-dessous)
3. **Étape 1** — subagent `spec` : Specs → **pause, GO**
4. **Étape 2** — subagent `spec` : GWT → **pause, GO**
5. **Étape 3** — subagent `test` : tests rouges → **pause, GO**
6. **Étape 4** — subagent `archi` : architecture → **pause, GO**
7. **Étape 5** — subagent `dev` : implémentation (vert) → **pause, GO**
8. **Étape 6** — subagent `review` : review (KO → boucle dev) → **pause, GO**
9. **Étape 7** — orchestrateur (agent principal) : clôture, vérifs finales, **archive** dans `.agent/features/archived/`

## Règle absolue : GO à chaque étape

- **Chaque étape marque une pause** : l'orchestrateur résume (fait, vérifications, points de vigilance) et demande le **GO explicite de l'utilisateur** avant de lancer la suivante
- `stop dev` : frein d'urgence à tout moment — arrêt immédiat, l'étape courante reste `STATUS: EN COURS`

## Template `.agent/features/<feature-name>.md`

Voir le template complet dans `feature-workflow.md` (sections `## Étape 1 — Specs` … `## Étape 6 — Review`, `## Avancement`, `## Notes / décisions`).

## Règles
- Ne pas créer de fichier feature sans accord explicite
- Le fichier évolue avec les décisions prises en cours de route ; les sections des étapes passées ne sont jamais effacées
- L'archivage (déplacement vers `.agent/features/archived/`) = validation acceptée par l'utilisateur

## Règles d'intervention (GO)
- **Sans `GO`** → je ne modifie que des fichiers `.md` (documentation).
  Si du code doit changer, je le propose et attends `GO`.
- **Avec `GO` (étape courante)** → j'ajoute `GO` au fichier feature → je coche la case d'avancement de l'étape → je lance l'étape suivante avec le subagent approprié.
- **`stop dev`** → j'arrête immédiatement, je remets l'étape courante à `STATUS: EN COURS` et je décoche la case d'avancement concernée.
- **Dérogation** → si tu veux outrepaser l'absence de `GO`, tu le demandes
  explicitement dans ton prompt → je réponds par une question **OUI/NON**
  → si tu confirmes, j'exécute pour cette fois. Je ne propose pas d'ajouter
  `GO` au fichier.
