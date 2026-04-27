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

              <div className="flex flex-col gap-3 pt-4">
                <h3 className="text-primary font-bold">Tours guidés</h3>
                <button
                  type="button"
                  onClick={handleStudioTour}
                  className="btn-secondary w-fit"
                >
                  Tour du studio
                </button>
                <button
                  type="button"
                  onClick={handleInstrumentTour}
                  className="btn-secondary w-fit"
                >
                  Tour des instruments
                </button>
                <button
                  type="button"
                  onClick={handlePatternTour}
                  className="btn-secondary w-fit"
                >
                  Tour des patterns
                </button>
                <button
                  type="button"
                  onClick={handleLibraryTour}
                  className="btn-secondary w-fit"
                >
                  Tour de la bibliothèque
                </button>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <h3 className="text-primary font-bold">Raccourcis clavier</h3>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>
                    <code className="text-primary">Ctrl + Entrée</code> Play /
                    Stop
                  </li>
                  <li>
                    <code className="text-primary">Ctrl + ↑ / ↓</code> BPM +/-
                  </li>
                  <li>
                    <code className="text-primary">( )</code> avec sélection →
                    grouper
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <h3 className="text-primary font-bold">Syntaxe</h3>
                <code className="text-primary font-mono bg-field px-4 py-3 rounded-lg">
                  P Ts K P Ts K P .
                </code>
                <span className="text-xs text-text-secondary">
                  Écris les symboles séparés par des espaces
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
