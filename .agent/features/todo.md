# Todo — Évolutions & Correctifs

## Structure

Chaque entrée suit ce format :

```md
- [ ] **Titre court** — *priorité* — `tag1, tag2`
  Description courte, contexte, pistes d'implémentation.
```

**Priorités :** `P0` (bloquant/critique) → `P1` (important) → `P2` (souhaitable) → `P3` (nice to have)

**Tags :** `frontend`, `backend`, `db`, `audio`, `library`, `ux`, `archi`, `bug`, `doc`

---

## 🐞 Bugs

...

---

## ✨ Features

- [ ] **Wiki / tutoriel par instrument** — *P2* — `frontend, ux`
  Ajouter un éditeur de contenu riche (texte, images, vidéos embarquées) pour chaque instrument, permettant de créer un mini tutoriel (ex: technique de frappe, contexte d'utilisation).
  - Piste : éditeur WYSIWYG léger (TinyMCE, TipTap/ProseMirror, ou Slate)
  - Vidéos : embed YouTube/Vimeo ou upload + stockage local
  - À décider : écran dédié `/wiki` ou intégration dans l'écran de configuration des instruments (`/configuration/instruments`)
  - Stockage : nouvelle table SQL `instrument_notes` ou colonne `notes` dans `instruments`

---

## ⚡ Améliorations

...

---

## 🔧 Technique / Architecture

...

---

## 📚 Documentation

...
