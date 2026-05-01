import { useNavigate } from 'react-router-dom';
import {
  runInstrumentTour,
  runPatternTour,
  runLibraryTour,
  runStudioTour,
} from '../../onboarding/components/OnboardingDriver';

export default function GuideScreen() {
  const navigate = useNavigate();

  const handleStudioTour = () => {
    localStorage.removeItem('studio_tour_seen');
    navigate('/workspace');
    setTimeout(() => {
      runStudioTour(navigate);
    }, 500);
  };

  const handleInstrumentTour = () => {
    localStorage.removeItem('instruments_tour_seen');
    navigate('/configuration/instruments');
    setTimeout(() => {
      runInstrumentTour(navigate);
    }, 500);
  };

  const handlePatternTour = () => {
    localStorage.removeItem('patterns_tour_seen');
    navigate('/configuration/patterns');
    setTimeout(() => {
      runPatternTour(navigate);
    }, 500);
  };

  const handleLibraryTour = () => {
    localStorage.removeItem('library_tour_seen');
    navigate('/library');
    setTimeout(() => {
      runLibraryTour(navigate);
    }, 500);
  };

  return (
    <div className="content-page">
      <div className="daw-layout">
        <div className="daw-main">
          <div className="workspace-section">
            <div className="section-header">
              <h2 className="section-title">Guide</h2>
            </div>
            <div className="workspace-section-content space-y-4">
              <p className="text-text-secondary">
                Beat & Teach est une application de composition musicale. Écris
                ton pattern avec des symboles, écoute le résultat, et apprends
                les rythmes.
              </p>

              <div className="flex flex-col gap-3 ">
                <h3 className="section-title">Tours guidés</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleStudioTour}
                    className="btn-secondary w-fit"
                  >
                    Studio
                  </button>
                  <button
                    type="button"
                    onClick={handleInstrumentTour}
                    className="btn-secondary w-fit"
                  >
                    Instruments
                  </button>
                  <button
                    type="button"
                    onClick={handlePatternTour}
                    className="btn-secondary w-fit"
                  >
                    Patterns
                  </button>
                  <button
                    type="button"
                    onClick={handleLibraryTour}
                    className="btn-secondary w-fit"
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
                  Ici le pattern mesure 6 temps et le 3ème temps est divisé en 3
                  notes dont 1 silence.
                </span>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>
                    <code className="text-primary font-bold">( symboles )</code>{' '}
                    Diviser un temps en succession de notes.
                  </li>
                  <li>
                    <code className="text-primary font-bold">
                      Selection de texte + ( / )
                    </code>{' '}
                    Entourer toute la sélection par <code>()</code>.
                  </li>
                  <li>
                    <code className="text-primary font-bold">
                      Autocomplétion
                    </code>{' '}
                    La liste des instruments commençant par cette lettre est
                    suggérée.
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
                <h3 className="section-title">Contrôles</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>
                    <code className="text-primary font-bold">
                      Ctrl + Entrée
                    </code>{' '}
                    Play / Stop.
                  </li>
                  <li>
                    <code className="text-primary font-bold">Ctrl + ↑ / ↓</code>{' '}
                    BPM +/-.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="section-title">Raccourcis clavier</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>
                    <code className="text-primary font-bold">⟵ / ⟶</code>{' '}
                    Déplacer le curseur à gauche / droite.
                  </li>
                  <li>
                    <code className="text-primary font-bold">Maj + ⟵ / ⟶</code>{' '}
                    Retirer / Ajouter un caractère à la sélection.
                  </li>
                  <li>
                    <code className="text-primary font-bold">Ctrl + ⟵ / ⟶</code>{' '}
                    Déplacer le curseur vers le symbole de gauche / droite.
                  </li>
                  <li>
                    <code className="text-primary font-bold">
                      Maj + Ctrl + ⟵ / ⟶
                    </code>{' '}
                    Ajouter le symbole de gauche / droite à la sélection.
                  </li>
                  <li>
                    <code className="text-primary font-bold">
                      Maj + Clic droit
                    </code>{' '}
                    Sélectionner le texte depuis la position du curseur.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
