import AudioControls from '../../audio/components/AudioControls';
import InstrumentsLegend from '../../instruments/components/InstrumentsLegend';
import { Pattern } from '../models/pattern-model';
import SavePatternForm from './form/SavePatternForm';
import SentencesForm from './form/SentencesForm';
import PatternSteps from './PatternSteps';

type PatternComposerProps = {
  pattern: Pattern;
  changeSentence: (index: number, value: string) => void;
  addSentence: () => void;
  removeSentence: (index: number) => void;
  normalizeAllSentences: () => void;
  changeHighlight: (
    sentenceIndex: number,
    tokenIndex: number,
    color: string | null,
  ) => void;
};

export default function PatternComposer({
  pattern,
  changeSentence,
  addSentence,
  removeSentence,
  normalizeAllSentences,
  changeHighlight,
}: PatternComposerProps) {
  return (
    <>
      <div className="workspace-section-content">
        <InstrumentsLegend />
      </div>
      <div className="workspace-section-content">
        <SentencesForm
          sentences={pattern.sentences}
          onChangeSentence={changeSentence}
          onRemoveSentence={removeSentence}
          onAddSentence={addSentence}
          onBlur={normalizeAllSentences}
          withBackground
        />
        <PatternSteps
          sentences={pattern.sentences}
          highlights={pattern.highlights}
          onChangeHighlight={changeHighlight}
        />
        <div className="flex justify-end">
          <SavePatternForm pattern={pattern} />
        </div>
      </div>
      <div className="workspace-section-content">
        <AudioControls sentences={pattern.sentences} />
      </div>
    </>
  );
}
