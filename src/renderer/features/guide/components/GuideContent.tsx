import { VolumeX, Palette, Music, ArrowUpDown, Undo2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  runInstrumentTour,
  runLibraryTour,
  runStudioTour,
} from '../../onboarding/components/OnboardingDriver';
import { waitForElement } from '../../onboarding/utils/createTour';
import GuideShortcuts from './GuideShortcuts';

export default function GuideContent() {
  const navigate = useNavigate();

  const handleStudioTour = (): void => {
    navigate('/workspace');
    (async (): Promise<void> => {
      await waitForElement('.daw-layout');
      runStudioTour(() => navigate('/guide'));
    })();
  };

  const handleInstrumentTour = (): void => {
    navigate('/configuration/instruments');
    (async (): Promise<void> => {
      await waitForElement('.content-page');
      runInstrumentTour(() => navigate('/guide'));
    })();
  };

  const handleLibraryTour = (): void => {
    navigate('/library');
    (async (): Promise<void> => {
      await waitForElement('.content-page');
      runLibraryTour(() => navigate('/guide'));
    })();
  };

  return (
    <div className="workspace-section-content space-y-4">
      <p className="text-text-secondary">
        Beat & Teach est une application de composition musicale. Écris ton
        pattern avec des symboles, écoute le résultat, et apprends les rythmes.
      </p>

      <div className="flex flex-col gap-3">
        <h3 className="section-title">Tours guidés</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleStudioTour}
            className="btn-secondary w-full"
          >
            Studio
          </button>
          <button
            type="button"
            onClick={handleInstrumentTour}
            className="btn-secondary w-full"
          >
            Instruments
          </button>
          <button
            type="button"
            onClick={handleLibraryTour}
            className="btn-secondary w-full"
          >
            Bibliothèque
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="section-title">Syntaxe</h3>
        <span className="text-xs text-text-secondary">
          Écris les symboles séparés par des espaces.
        </span>
        <code className="text-primary font-mono bg-field px-4 py-3 rounded-lg">
          P Ts K P Ts K P .
        </code>
        <span className="text-xs text-text-secondary">
          Ici le pattern mesure 8 temps.
        </span>

        <code className="text-primary font-mono bg-field px-4 py-3 rounded-lg">
          P Ts (K . P) Ts K .
        </code>
        <span className="text-xs text-text-secondary">
          Ici le pattern mesure 6 temps et le 3ème temps est divisé en 3 notes
          dont 1 silence.
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="section-title">Édition des steps</h3>
        <span className="text-xs text-text-secondary">
          Survole une step dans la grille pour ouvrir le panneau d&apos;édition.
        </span>
        <ul className="space-y-2 text-sm text-text-secondary bg-field px-4 py-3 rounded-lg">
          <li className="flex items-start gap-2">
            <VolumeX size={16} className="mt-0.5 text-primary shrink-0" />
            <span>
              <b>Muet</b> : Coupe le son de la step sans effacer le symbole.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Palette size={16} className="mt-0.5 text-primary shrink-0" />
            <span>
              <b>Couleurs</b> : 5 couleurs d&apos;annotation (rouge, bleu, vert,
              jaune, orange) pour marquer visuellement les steps : temps fort,
              liaison, ghost note, accent, syncope.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Music size={16} className="mt-0.5 text-primary shrink-0" />
            <span>
              <b>Note</b> : Ajuste la hauteur perçue de l&apos;instrument en
              cliquant sur une note dans la bande (disponible si
              l&apos;instrument a une fréquence de référence).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <ArrowUpDown size={16} className="mt-0.5 text-primary shrink-0" />
            <span>
              <b>Molette</b> : Sur une step, utilise la molette de la souris
              pour monter ou descendre la hauteur par demi-tons.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Undo2 size={16} className="mt-0.5 text-primary shrink-0" />
            <span>
              <b>Double-clic</b> : Sur une step, double-clique pour
              réinitialiser la hauteur à sa valeur d&apos;origine.
            </span>
          </li>
        </ul>
      </div>

      <GuideShortcuts />
    </div>
  );
}
