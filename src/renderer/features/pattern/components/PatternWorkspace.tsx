import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams, useBlocker } from 'react-router-dom';
import usePatternSession from '../hooks/usePatternSession';
import useAudio from '../../audio/hooks/useAudio';
import { Pattern, DEFAULT_PATTERN } from '../models/pattern-model';
import AudioControls from '../../audio/components/AudioControls';
import InstrumentsLegend from '../../instruments/components/InstrumentsLegend';
import SideBar from '../../../components/SideBar';
import PatternChoices from './PatternChoices';
import PatternComposer from './PatternComposer';
import SavePatternModal from './form/SavePatternModal';
import Modal from '../../../components/Modal';
import { useGuideModalContext } from '../../guide/components/GuideModalProvider';
import { useInstrumentsContext } from '../../instruments/contexts/InstrumentsContext';
import { areAllSymbolsValid } from '../utils/pattern-validator';
import OnboardingDriver from '../../onboarding/components/OnboardingDriver';

export default function PatternWorkspace() {
  const { showGuideModal } = useGuideModalContext();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        showGuideModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showGuideModal]);

  const {
    pattern,
    setPattern,
    changeSentence,
    addSentence,
    removeSentence,
    changeHighlight,
    changeFrequency,
    resetPattern,
    sentencesForPlayback,
    mutedSteps,
    toggleMute,
    isDirty,
    markAsSaved,
  } = usePatternSession();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent): void => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  });
  const { activeSteps, playing, updateTrack } = useAudio();
  const { instruments } = useInstrumentsContext();
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingPattern, setPendingPattern] = useState<
    Pattern | null | undefined
  >(undefined);
  const [searchParams, setSearchParams] = useSearchParams();
  const setPatternRef = useRef(setPattern);
  setPatternRef.current = setPattern;

  const blocker = useBlocker(isDirty);

  const handleCancel = (): void => {
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
    setPendingPattern(undefined);
  };

  const executePendingPattern = useCallback((): void => {
    if (pendingPattern === undefined) return;
    setSelectedPattern(pendingPattern);
    if (pendingPattern) {
      setPattern(pendingPattern);
    } else {
      resetPattern();
    }
    setPendingPattern(undefined);
  }, [pendingPattern, setPattern, resetPattern]);

  const handleDiscard = (): void => {
    markAsSaved();
    executePendingPattern();
    if (blocker.state === 'blocked') {
      blocker.proceed();
    }
  };

  const handleSaveThenProceed = useCallback((): void => {
    setShowSaveModal(true);
  }, []);

  const onSaveModalClose = useCallback((): void => {
    setShowSaveModal(false);
  }, []);

  const onSaveModalSaved = useCallback((): void => {
    markAsSaved();
    setShowSaveModal(false);
    executePendingPattern();
    if (blocker.state === 'blocked') {
      blocker.proceed();
    }
  }, [markAsSaved, executePendingPattern, blocker]);

  const showDiscardModal =
    pendingPattern !== undefined || blocker.state === 'blocked';

  const validSymbols = useMemo(
    () => instruments.map((i) => i.symbol),
    [instruments],
  );

  const allValid = useMemo(
    () => areAllSymbolsValid(sentencesForPlayback, validSymbols),
    [sentencesForPlayback, validSymbols],
  );

  useEffect(() => {
    if (playing && allValid) {
      updateTrack(sentencesForPlayback);
    }
  }, [playing, allValid, sentencesForPlayback, updateTrack]);

  useEffect(() => {
    const exampleParam = searchParams.get('example');
    if (exampleParam) {
      setPatternRef.current({
        ...DEFAULT_PATTERN,
        name: 'Exemple',
        sentences: [exampleParam],
        highlights: [
          Array(
            exampleParam
              .trim()
              .split(/\s+/)
              .filter((t) => t.length > 0).length,
          ).fill(null),
        ],
      });
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const selectPattern = (selected: Pattern | null): void => {
    if (isDirty) {
      setPendingPattern(selected);
    } else {
      setSelectedPattern(selected);
      if (selected) {
        setPattern(selected);
      } else {
        resetPattern();
      }
    }
  };

  return (
    <OnboardingDriver tourKey="studio" tourPageSelector=".daw-layout">
      <div className="daw-layout">
        <div className="transport-bar">
          <AudioControls sentences={sentencesForPlayback} />
        </div>
        <div className="daw-columns">
          <SideBar>
            <PatternChoices
              selectPattern={selectPattern}
              onSave={() => setShowSaveModal(true)}
              canSave={
                pattern.sentences.length > 0 &&
                pattern.sentences.every((s) => s.trim().length > 0)
              }
              selectedId={selectedPattern?.id ?? null}
            />
            <InstrumentsLegend />
          </SideBar>
          <div className="daw-main">
            <PatternComposer
              pattern={pattern}
              changeSentence={changeSentence}
              addSentence={addSentence}
              removeSentence={removeSentence}
              changeHighlight={changeHighlight}
              changeFrequency={changeFrequency}
              activeSteps={activeSteps}
              mutedSteps={mutedSteps}
              toggleMute={toggleMute}
            />
          </div>
        </div>

        {showDiscardModal && (
          <Modal onClose={handleCancel}>
            <div className="relative bg-surface border border-border rounded-lg p-6 max-w-md">
              <div className="flex flex-col gap-4">
                <p className="section-title">Modifications non sauvegardées</p>
                <p className="text-text-secondary font-mono text-sm">
                  Vous avez des modifications en cours. Que souhaitez-vous faire
                  ?
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="btn-confirm-delete"
                  >
                    Ignorer
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveThenProceed}
                    className="btn-add"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {showSaveModal && (
          <SavePatternModal
            pattern={pattern}
            selectedPattern={selectedPattern}
            onClose={onSaveModalClose}
            onSaved={onSaveModalSaved}
          />
        )}
      </div>
    </OnboardingDriver>
  );
}
