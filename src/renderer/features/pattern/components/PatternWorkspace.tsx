import { Pattern } from '../models/pattern-model';
import PatternComposer from './PatternComposer';
import usePattern from '../hooks/usePattern';
import PatternChoices from './PatternChoices';
import usePatterns from '../hooks/usePatterns';

export default function PatternWorkspace() {
  const { pattern, setPattern, changePatternSentence } = usePattern();
  const { patterns } = usePatterns();

  const selectPattern = (id: number): void => {
    const selectedPattern: Pattern | undefined = patterns.find(
      (pat) => pat.id === id,
    );
    if (selectedPattern) setPattern(selectedPattern);
  };

  return (
    <div className="flex flex-col items-center p-8">
      <PatternChoices patterns={patterns} selectPattern={selectPattern} />
      <PatternComposer
        pattern={pattern}
        changePatternSentence={changePatternSentence}
      />
    </div>
  );
}
