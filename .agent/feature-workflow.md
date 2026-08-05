# Workflow feature en 7 étapes — Pipeline avec subagents

## Principe

Chaque feature passe par 7 étapes exécutées par des **subagents opencode**
(définis dans `.opencode/agent/`), orchestrées par l'**agent principal** :

```
Utilisateur ── demande ──► Orchestrateur (agent principal)
                              │  task: spec      ──► étape 1 (Specs)   ──► GO
                              │  task: spec      ──► étape 2 (GWT)     ──► GO
                              │  task: test      ──► étape 3 (RED)     ──► GO
                              │  task: archi     ──► étape 4 (Archi)   ──► GO
                              │  task: dev       ──► étape 5 (GREEN)   ──► GO
                              │  task: review    ──► étape 6 (Review)  ──► KO ? ──► boucle dev
                              │                                          OK
                              └── étape 7 (Clôture) ──► archive
```

## Règle absolue : pause + GO à chaque étape

- L'orchestrateur ne lance **jamais** deux étapes à la suite sans le **GO
  explicite de l'utilisateur**
- Après chaque étape : l'orchestrateur résume (3-5 lignes : ce qui a été fait,
  résultat des vérifications, points de vigilance) et demande la validation
  OUI/NON avant de lancer l'étape suivante
- `stop dev` : frein d'urgence à tout moment — l'orchestrateur arrête, marque
  l'étape courante `STATUS: EN COURS` (non validée) et attend

## Les 7 étapes

| Étape | Agent | Entrée (lit) | Sortie (écrit dans le feature file) | Critère de sortie |
|-------|-------|--------------|--------------------------------------|-------------------|
| 1. Specs | `spec` | demande utilisateur | `## Étape 1 — Specs` : problème, solution cible, périmètre, RG impactées, questions ouvertes | Specs validées par l'utilisateur |
| 2. GWT | `spec` | Specs | `## Étape 2 — GWT` : cas Given/When/Then (nominaux, limites, erreurs) | Cas de test validés |
| 3. Tests rouges | `test` | GWT | `## Étape 3 — Tests rouges` : fichiers `*.test.ts` créés, `npm run test` → ROUGE, échecs consignés | Tests écrits et échouants |
| 4. Architecture | `archi` | Specs + GWT + Tests | `## Étape 4 — Architecture` : analyse contradictoire, décisions actées, flux de données, fichiers cibles/modifiés, cas limites | Architecture validée |
| 5. Développement | `dev` | Architecture | `## Étape 5 — Développement` : implémentation minimale, `npm run test` VERT + `typecheck` + `lint`, divergences justifiées | Les 3 vérifications passent |
| 6. Review | `review` | diff + toutes sections | `## Étape 6 — Review` : verdict `OK`/`KO` + checklist de corrections | Verdict OK |
| 7. Clôture | orchestrateur | fichier complet + vérifs | Archiver le fichier dans `.agent/features/archived/` | Validation utilisateur |

## Le fil d'Ariane — contrat du fichier feature

Le fichier `.agent/features/<feature>.md` est la **source unique de vérité** et
la mémoire de la feature :

- **Chaque subagent commence par le lire en entier** (son contexte complet
  vient du fichier, pas de la session) et **termine en le mettant à jour**
- Sections fixes, dans l'ordre (voir template ci-dessous)
- Chaque étape porte un marqueur `STATUS: EN COURS / OK / KO` en tête de sa
  section
- `## Avancement` : les checkboxes refletent l'état réel — on ne coche que ce
  qui est terminé et vérifié
- **Interdiction de modifier ou supprimer les sections des étapes précédentes**
  — l'historique est précieux (pattern `gerer-notes.md` : rounds d'analyse
  contradictoire conservés, complétés, jamais effacés). Les corrections d'une
  étape s'ajoutent dans SA section
- `## Notes / décisions` : décisions transverses, découvertes en cours de route

### Template du fichier feature

```markdown
# Feature: <nom>

## Contexte
<1-3 lignes : demande d'origine, lien avec le domaine>

## Étape 1 — Specs
STATUS: EN COURS | OK
...

## Étape 2 — GWT
STATUS: EN COURS | OK
...

## Étape 3 — Tests rouges
STATUS: EN COURS | OK
...

## Étape 4 — Architecture
STATUS: EN COURS | OK
...

## Étape 5 — Développement
STATUS: EN COURS | OK
...

## Étape 6 — Review
STATUS: EN COURS | OK | KO
...

## Avancement
- [ ] 1. Specs rédigées
- [ ] 2. GWT rédigés
- [ ] 3. Tests rouges
- [ ] 4. Architecture validée
- [ ] 5. Développement (vert)
- [ ] 6. Review OK
- [ ] 7. Clôture (archivée)

## Notes / décisions
...
```

## Boucle review → dev (étape 6)

- `review` écrit `STATUS: KO` + la checklist `- [ ] <correction>` dans
  `## Étape 6 — Review`
- L'orchestrateur présente la liste, demande le GO, relance `dev` (même
  feature, fichier relu) puis relance `review`
- `review` réécrit sa section (les rounds précédents restent visibles, marqués
  de leur issue) et rend le nouveau verdict

## Étape 7 — Clôture

L'orchestrateur :
1. Lance `npm run test`, `npm run typecheck`, `npm run lint` une dernière fois
2. Vérifie que toutes les checkboxes de `## Avancement` sont cochées et le
   `STATUS` de chaque étape à `OK`
3. Résume la feature terminée et demande la validation finale
4. Déplace le fichier dans `.agent/features/archived/` — ce dossier ne doit
   pas être relu sauf demande explicite

## Rappels

- Le TDD (workflow.md) s'applique uniquement au code métier : le pipeline
  l'institutionnalise (étapes 3 et 5 = RED/GREEN, étape 6 = refacto review)
- Pas de TDD frontend : composants React, hooks UI, contexts — l'étape 3 ne
  génère des tests que pour la logique métier
- Les subagents héritent des instructions projet (`opencode.json` → `.agent/`)
  : règles strictes (pas de `for...of`, pas de commentaires, pas d'implicit
  `any`...) applicables partout, sans duplication
- Modèle des subagents : héritage du modèle courant (non surchargé)
- Permission des subagents `spec`/`archi`/`review` : écriture limitée au
  dossier `.agent/features/` ; `test` : fichiers `src/**/*.test.ts` + feature ;
  `dev` : écriture complète
