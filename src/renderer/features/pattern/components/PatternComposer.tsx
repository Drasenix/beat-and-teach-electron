import { Pattern } from '../models/pattern-model';
import SentencesForm from './form/SentencesForm';
import PatternSteps from './PatternSteps';
import useAudio from '../../audio/hooks/useAudio';

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
  const { activeStep } = useAudio();

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
          activeColumnIndex={activeStep}
        />
      </div>
    </div>
  );
}
