<img src="assets/banner.svg" width="100%" />

<br>

<p align="center">
  <strong>Beat & Teach</strong> — une application de composition musicale rythmique assistée, destinée à l'apprentissage du beatbox.
</p>

<br>

<div align="center">

![MIT License](https://img.shields.io/badge/license-MIT-%23679ff9)
![Electron](https://img.shields.io/badge/Electron-%23030712?logo=electron&labelColor=%231d273c)
![React](https://img.shields.io/badge/React-%23030712?logo=react&labelColor=%231d273c)
![TypeScript](https://img.shields.io/badge/TypeScript-%23030712?logo=typescript&labelColor=%231d273c)
![Tone.js](https://img.shields.io/badge/Tone.js-%23030712?logo=tone.js&labelColor=%231d273c)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-%23030712?logo=tailwindcss&labelColor=%231d273c)
![SQLite](https://img.shields.io/badge/SQLite-%23030712?logo=sqlite&labelColor=%231d273c)

</div>

<br>

---

<br>

## ✦ Présentation

**Beat & Teach** transforme la notation rythmique en un langage symbolique simple et visuel. Chaque symbole — `P`, `Ts`, `K`, `Bw`, `Lo` — représente un son percussif. Composez des séquences, superposez des pistes, associez vos propres samples, et écoutez le résultat en temps réel.

L'outil idéal pour les beatboxers, musiciens et enseignants en éveil musical qui veulent noter, apprendre et partager des patterns rythmiques.

<br>

## ✦ Fonctionnalités

|                                |                                                                                                            |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| **🎵 Notation symbolique**     | Écrivez vos rythmes avec un langage textuel intuitif :`P Ts (K . P) Ts K .`                                |
| **🎛️ Séquenceur multi-pistes** | Superposez plusieurs lignes rythmiques avec visualisation en grille temps réel                             |
| **🔊 Lecture temps réel**      | Moteur audio basé sur Tone.js — boucle synchronisée, step callback pour l'UI                               |
| **🎚️ Banque d'instruments**    | 20 instruments préchargés, import de vos propres sons, mapping symbole → sample                            |
| **📦 Bibliothèque .beatpack**  | Exportez et importez vos patterns et instruments dans un format portable                                   |
| **🎓 Visites guidées**         | Tours interactifs driver.js pour une prise en main immédiate (Studio, Instruments, Patterns, Bibliothèque) |

<br>

## ✦ Stack technique

```
Electron · React · TypeScript · Tone.js · Tailwind CSS · SQLite (better-sqlite3)
Webpack · Jest · Electron Builder · driver.js · Lucide Icons · adm-zip
```

<br>

## ✦ Démarrer

```bash
# Cloner le dépôt
git clone https://github.com/Drasenix/beat-and-teach-electron.git
cd beat-and-teach-electron

# Installer les dépendances
npm install

# Lancer le développement
npm start
```

<br>

## ✦ Développement

```bash
npm start          # Dev complet (webpack + electronmon)
npm run test       # Tests Jest (TDD pour le code métier)
npm run lint       # ESLint — vérification du code
npm run build      # Build production
npm run package    # Package desktop (electron-builder)
```

<br>

## ✦ Premiers pas

1. Lancez l'application avec `npm start`
2. Dirigez-vous vers le **Studio** (`/workspace`)
3. Sélectionnez un pattern existant ou créez-en un nouveau
4. Tapez des symboles dans les pistes : `P Ts K . P (Ts P) K`
5. Appuyez sur **Play** (Ctrl+Enter) pour écouter
6. Explorez la **Configuration des instruments** pour personnaliser les sons
7. Utilisez la **Bibliothèque** pour exporter et partager vos créations

<br>

## ✦ Raccourcis clavier

| Touche            | Action                    |
| ----------------- | ------------------------- |
| `F1`              | Aide — raccourcis         |
| `Ctrl + Enter`    | Play / Stop               |
| `Ctrl + ↑`        | BPM +1                    |
| `Ctrl + ↓`        | BPM -1                    |
| `↑` / `↓`         | Navigation autocomplétion |
| `Space` / `Enter` | Valider suggestion        |
| `Ctrl + Espace`   | Afficher/Masquer autocomp |
| `Escape`          | Fermer modale             |

<br>

## ✦ Démo

> 🎥 _Une capture d'écran ou un screencast du studio en action sera bientôt disponible ici._

<br>

## ✦ Licence

MIT © Beat & Teach
