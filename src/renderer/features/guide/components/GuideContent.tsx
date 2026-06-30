import {
  AudioLines,
  FileHeadphone,
  FileSliders,
  VolumeX,
  Palette,
  Music,
  ArrowUpDown,
  Undo2,
} from 'lucide-react';
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
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
      runStudioTour(() => navigate('/guide'));
    })();
  };

  const handleInstrumentTour = (): void => {
    navigate('/configuration/instruments');
    (async (): Promise<void> => {
      await waitForElement('.instrument-symbol');
      runInstrumentTour(() => navigate('/guide'));
    })();
  };

  const handleLibraryTour = (): void => {
    navigate('/library');
    (async (): Promise<void> => {
      await waitForElement('.library-item');
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
        <div className="grid grid-cols-3 gap-3">
          <div className="div-animated-wrapper">
            <button
              type="button"
              onClick={handleStudioTour}
              className="link-animated-inner inline-flex items-center justify-center gap-2"
            >
              <AudioLines size={16} /> Studio
            </button>
          </div>
          <div className="div-animated-wrapper">
            <button
              type="button"
              onClick={handleInstrumentTour}
              className="link-animated-inner inline-flex items-center justify-center gap-2"
            >
              <FileHeadphone size={16} /> Instruments
            </button>
          </div>
          <div className="div-animated-wrapper">
            <button
              type="button"
              onClick={handleLibraryTour}
              className="link-animated-inner inline-flex items-center justify-center gap-2"
            >
              <FileSliders size={16} /> Bibliothèque
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="section-title">Syntaxe</h3>
        <span className="text-sm text-text-secondary">
          La notation utilise des symboles séparés par des espaces. Chaque
          symbole correspond soit à un instrument, soit à une instruction
          spéciale (silence, groupe).
        </span>

        <div className="text-sm font-mono bg-field px-4 py-3 rounded-lg flex flex-col gap-1">
          <div className="flex gap-3">
            <span className="w-8 text-primary">P</span>
            <span className="text-text-secondary">kickdrum</span>
          </div>
          <div className="flex gap-3">
            <span className="w-8 text-primary">Ts</span>
            <span className="text-text-secondary">hihat</span>
          </div>
          <div className="flex gap-3">
            <span className="w-8 text-primary">K</span>
            <span className="text-text-secondary">rimshot</span>
          </div>
          <div className="flex gap-3">
            <span className="w-8 text-primary">Pf</span>
            <span className="text-text-secondary">snare</span>
          </div>
          <div className="flex gap-3">
            <span className="w-8 text-primary">.</span>
            <span className="text-text-secondary">silence</span>
          </div>
          <div className="flex gap-3">
            <span className="w-8 text-primary">( )</span>
            <span className="text-text-secondary">groupe de notes</span>
          </div>
        </div>

        <span className="text-sm text-text-secondary">
          Le point <code className="text-primary font-semibold">.</code>{' '}
          représente un silence. Il compte comme un temps mais aucun son
          n&apos;est joué.
        </span>

        <span className="text-sm text-text-secondary">
          Les parenthèses{' '}
          <code className="text-primary font-semibold">(Ts K)</code> jouent
          plusieurs notes dans un même temps, en succession rapide.
        </span>

        <span className="text-sm text-text-secondary">
          Pour compter le nombre de temps : chaque symbole hors groupe = 1
          temps, chaque groupe{' '}
          <code className="text-primary font-semibold">()</code> = 1 temps (les
          notes à l&apos;intérieur sont jouées dans le même temps).
        </span>

        <code className="text-primary font-mono bg-field px-4 py-3 rounded-lg border border-primary">
          P Ts K P Ts K P .
        </code>
        <span className="text-sm text-text-secondary">
          Ce pattern mesure 8 temps. Chaque symbole est joué une fois, le point
          final est un silence.
        </span>

        <code className="text-primary font-mono bg-field px-4 py-3 rounded-lg border border-primary">
          P Ts (K . P) Ts K .
        </code>
        <span className="text-sm text-text-secondary">
          Ce pattern mesure 6 temps. Le 3ème temps est un groupe de 3 notes (K,
          silence, P) jouées en succession rapide dans le même temps.
        </span>

        <button
          type="button"
          onClick={() => navigate('/configuration/instruments')}
          className="text-primary hover:underline text-sm font-mono text-left"
        >
          → Voir tous les instruments
        </button>
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
              jaune, orange) pour marquer visuellement les steps. Par
              exemple&nbsp;: rouge pour un temps fort, bleu pour une liaison,
              vert pour un ghost note, jaune pour un accent, orange pour une
              syncope.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Music size={16} className="mt-0.5 text-primary shrink-0" />
            <span>
              <b>Note</b> : Ajuste la hauteur perçue de l&apos;instrument en
              cliquant sur une note dans la bande. La bande n&apos;apparaît que
              pour les instruments dont la hauteur a été détectée (via le bouton
              « Détecter » dans le formulaire d&apos;édition de
              l&apos;instrument, ou via l&apos;enregistreur).
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
