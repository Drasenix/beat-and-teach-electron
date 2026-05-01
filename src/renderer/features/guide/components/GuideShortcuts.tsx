export default function GuideShortcuts() {
  return (
    <>
      <div className="flex flex-col gap-3">
        <h3 className="section-title">Outils</h3>
        <ul className="space-y-2 text-sm text-text-secondary bg-field px-4 py-3 rounded-lg">
          <li>
            <code className="text-primary font-bold">( symboles )</code> Diviser
            un temps en succession de notes.
          </li>
          <li>
            <code className="text-primary font-bold">
              Selection de texte + ( / )
            </code>{' '}
            Entourer toute la sélection par <code>()</code>.
          </li>
          <li>
            <code className="text-primary font-bold">Autocomplétion</code> La
            liste des instruments commençant par cette lettre est suggérée.
          </li>
          <li>
            <code className="text-primary font-bold">
              Autocomplétion + Espace / Entrée
            </code>{' '}
            Valide la selection.
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="section-title">Raccourcis clavier</h3>
        <ul className="space-y-2 text-sm text-text-secondary bg-field px-4 py-3 rounded-lg">
          <li>
            <code className="text-primary font-bold">F1</code> Afficher
            l&apos;aide.
          </li>
          <li>
            <code className="text-primary font-bold">⟵ / ⟶</code> Déplacer le
            curseur à gauche / droite.
          </li>
          <li>
            <code className="text-primary font-bold">Maj + ⟵ / ⟶</code> Retirer
            / Ajouter un caractère à la sélection.
          </li>
          <li>
            <code className="text-primary font-bold">Ctrl + ⟵ / ⟶</code>{' '}
            Déplacer le curseur vers le symbole de gauche / droite.
          </li>
          <li>
            <code className="text-primary font-bold">Maj + Ctrl + ⟵ / ⟶</code>{' '}
            Ajouter le symbole de gauche / droite à la sélection.
          </li>
          <li>
            <code className="text-primary font-bold">Maj + Clic droit</code>{' '}
            Sélectionner le texte depuis la position du curseur.
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="section-title">Contrôles</h3>
        <ul className="space-y-2 text-sm text-text-secondary bg-field px-4 py-3 rounded-lg">
          <li>
            <code className="text-primary font-bold">Ctrl + Entrée</code> Play /
            Stop.
          </li>
          <li>
            <code className="text-primary font-bold">Ctrl + ↑ / ↓</code> BPM
            +/-.
          </li>
        </ul>
      </div>
    </>
  );
}
