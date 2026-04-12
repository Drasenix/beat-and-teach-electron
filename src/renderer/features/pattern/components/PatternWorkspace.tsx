import { useState } from 'react';
import usePatternSession from '../hooks/usePatternSession';
import useAudio from '../../audio/hooks/useAudio';
import { Pattern } from '../models/pattern-model';
import AudioControls from '../../audio/components/AudioControls';
import InstrumentsLegend from '../../instruments/components/InstrumentsLegend';
import SideBar from '../../../components/SideBar';
import PatternChoices from './PatternChoices';
import PatternComposer from './PatternComposer';
import SavePatternModal from './form/SavePatternModal';

export default function PatternWorkspace() {
  const {
    pattern,
    setPattern,
    changeSentence,
    addSentence,
    removeSentence,
    normalizeAllSentences,
    changeHighlight,
    resetPattern,
    sentencesForPlayback,
    mutedSteps,
    toggleMute,
  } = usePatternSession();
  const { activeStep } = useAudio();
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const selectPattern = (selected: Pattern | null): void => {
    setSelectedPattern(selected);
    if (selected) {
      setPattern(selected);
    } else {
      resetPattern();
    }
  };

  return (
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
            normalizeAllSentences={normalizeAllSentences}
            changeHighlight={changeHighlight}
            activeColumnIndex={activeStep}
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
  );
}
