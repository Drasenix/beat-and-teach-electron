import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import usePatternSession from '../hooks/usePatternSession';
import useAudio from '../../audio/hooks/useAudio';
import { Pattern, DEFAULT_PATTERN } from '../models/pattern-model';
import AudioControls from '../../audio/components/AudioControls';
import InstrumentsLegend from '../../instruments/components/InstrumentsLegend';
import SideBar from '../../../components/SideBar';
import PatternChoices from './PatternChoices';
import PatternComposer from './PatternComposer';
import SavePatternModal from './form/SavePatternModal';
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
  } = usePatternSession();
  const { activeSteps, playing, updateTrack } = useAudio();
  const { instruments } = useInstrumentsContext();
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const setPatternRef = useRef(setPattern);
  setPatternRef.current = setPattern;

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
    setSelectedPattern(selected);
    if (selected) {
      setPattern(selected);
    } else {
      resetPattern();
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
        {showSaveModal && (
          <SavePatternModal
            pattern={pattern}
            selectedPattern={selectedPattern}
            onClose={() => setShowSaveModal(false)}
          />
        )}
      </div>
    </OnboardingDriver>
  );
}
