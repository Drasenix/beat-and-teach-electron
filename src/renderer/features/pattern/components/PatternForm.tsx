import { Pattern } from '../models/pattern-model';
import PatternControls from './PatternControls';
import PatternLegend from './PatternLegend';
import PatternEditor from './PatternEditor';

type PatternFormComponentProps = {
  pattern: Pattern;
  changePatternSentence: (event: any) => void;
};

export default function PatternFormComponent(props: PatternFormComponentProps) {
  const { pattern, changePatternSentence } = props;

  return (
    <div className="flex flex-col items-center w-full">
      <PatternEditor
        pattern={pattern}
        changePatternSentence={changePatternSentence}
      />

      <PatternControls sentence={pattern.sentence} />

      <PatternLegend />
    </div>
  );
}
