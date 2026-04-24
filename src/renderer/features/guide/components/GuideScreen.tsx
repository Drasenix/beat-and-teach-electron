import { useNavigate } from 'react-router-dom';
import {
  runInstrumentTour,
  runPatternTour,
} from '../../onboarding/components/OnboardingDriver';

export default function GuideScreen() {
  const navigate = useNavigate();

  const handleInstrumentTour = () => {
    localStorage.removeItem('instruments_tour_seen');
    navigate('/configuration/instruments');
    setTimeout(() => {
      runInstrumentTour();
    }, 500);
  };

  const handlePatternTour = () => {
    localStorage.removeItem('patterns_tour_seen');
    navigate('/configuration/patterns');
    setTimeout(() => {
      runPatternTour();
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
                  onClick={handleInstrumentTour}
                  className="btn-secondary w-fit"
                >
                  🎙 Tour des instruments
                </button>
                <button
                  type="button"
                  onClick={handlePatternTour}
                  className="btn-secondary w-fit"
                >
                  🕮 Tour des patterns
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
