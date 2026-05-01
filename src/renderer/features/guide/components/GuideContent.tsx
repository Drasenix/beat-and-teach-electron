import { useNavigate } from 'react-router-dom';
import {
  runInstrumentTour,
  runPatternTour,
  runLibraryTour,
  runStudioTour,
} from '../../onboarding/components/OnboardingDriver';
import GuideShortcuts from './GuideShortcuts';

export default function GuideContent() {
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
            onClick={handlePatternTour}
            className="btn-secondary w-full"
          >
            Patterns
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

      <GuideShortcuts />
    </div>
  );
}
