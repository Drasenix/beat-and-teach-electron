import { Pattern } from '../models/pattern-model';
import SentencesForm from './form/SentencesForm';
import PatternSteps from './PatternSteps';

type PatternComposerProps = {
  pattern: Pattern;
  changeSentence: (index: number, value: string) => void;
  addSentence: () => void;
  removeSentence: (index: number) => void;
  changeHighlight: (
    sentenceIndex: number,
    tokenIndex: number,
    color: string | null,
  ) => void;
  changeFrequency: (
    sentenceIndex: number,
    tokenIndex: number,
    frequency: number | null,
  ) => void;
  activeSteps?: number[];
  mutedSteps: Set<string>;
  toggleMute: (sentenceIndex: number, tokenIndex: number) => void;
};

export default function PatternComposer({
  pattern,
  changeSentence,
  addSentence,
  removeSentence,
  changeHighlight,
  changeFrequency,
  activeSteps,
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
          withBackground
        />
        <PatternSteps
          sentences={pattern.sentences}
          highlights={pattern.highlights}
          onChangeHighlight={changeHighlight}
          activeSteps={activeSteps}
          mutedSteps={mutedSteps}
          toggleMute={toggleMute}
          onFrequencyChange={changeFrequency}
        />
      </div>
    </div>
  );
}
