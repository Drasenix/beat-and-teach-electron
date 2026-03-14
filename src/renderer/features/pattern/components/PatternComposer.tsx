import AudioControls from '../../audio/components/AudioControls';
import InstrumentsLegend from '../../instruments/components/InstrumentsLegend';
import { Pattern } from '../models/pattern-model';
import PatternEditor from './PatternEditor';

type PatternComposerProps = {
  pattern: Pattern;
  changePatternSentence: (index: number, value: string) => void;
  addSentence: () => void;
  removeSentence: (index: number) => void;
  normalizeAllSentences: () => void;
};
export default function PatternComposer({
  pattern,
  changePatternSentence,
  addSentence,
  removeSentence,
  normalizeAllSentences,
}: PatternComposerProps) {
  return (
    <div className="flex flex-col items-center w-full">
      <PatternEditor
        pattern={pattern}
        changePatternSentence={changePatternSentence}
        addSentence={addSentence}
        removeSentence={removeSentence}
        normalizeAllSentences={normalizeAllSentences}
      />
      <AudioControls sentences={pattern.sentences} />
      <InstrumentsLegend />
    </div>
  );
}
