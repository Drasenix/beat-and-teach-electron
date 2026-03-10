import { Pattern } from '../models/pattern-model';
import InstrumentsLegend from '../../instruments/components/InstrumentsLegend';
import PatternEditor from './PatternEditor';
import AudioControls from '../../audio/components/AudioControls';

type PatternFormComponentProps = {
  pattern: Pattern;
  changePatternSentence: (event: any) => void;
};

export default function PatternComposer(props: PatternFormComponentProps) {
  const { pattern, changePatternSentence } = props;

  return (
    <div className="flex flex-col items-center w-full">
      <PatternEditor
        pattern={pattern}
        changePatternSentence={changePatternSentence}
      />

      <AudioControls sentence={pattern.sentence} />

      <InstrumentsLegend />
    </div>
  );
}
