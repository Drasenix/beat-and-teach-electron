import { Pattern } from '../models/pattern-model';
import PatternSteps from './PatternSteps';

type PatternEditorComponentProps = {
  pattern: Pattern;
  changePatternSentence: (event: any) => void;
};

export default function PatternEditor(props: PatternEditorComponentProps) {
  const { pattern, changePatternSentence } = props;

  return (
    <div className="w-full max-w-2xl">
      <label htmlFor="pattern-input" className="section-title block mb-2">
        Pattern
        <textarea
          id="pattern-input"
          value={pattern.sentence}
          onChange={changePatternSentence}
          placeholder={pattern.sentence || 'P Ts K . P (Ts P) K'}
          className="input-field w-full text-xl p-4 resize-none h-24 mt-2"
        />
        <PatternSteps pattern={pattern} />
      </label>
    </div>
  );
}
