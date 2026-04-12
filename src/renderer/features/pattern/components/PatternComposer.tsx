import { Pattern } from '../models/pattern-model';
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
  activeColumnIndex?: number | null;
  mutedSteps: Set<string>;
  toggleMute: (sentenceIndex: number, tokenIndex: number) => void;
};

export default function PatternComposer({
  pattern,
  changeSentence,
  addSentence,
  removeSentence,
  normalizeAllSentences,
  changeHighlight,
  activeColumnIndex,
  mutedSteps,
  toggleMute,
}: PatternComposerProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
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
          activeColumnIndex={activeColumnIndex}
          mutedSteps={mutedSteps}
          toggleMute={toggleMute}
        />
      </div>
    </div>
  );
}
