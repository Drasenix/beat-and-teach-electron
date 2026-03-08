import { Pattern } from '../models/pattern-model';
import PatternInputComponent from './PatternInput';
import usePattern from '../hooks/usePattern';
import PatternChoices from './PatternChoices';
import usePatterns from '../hooks/usePatterns';

export default function PatternConstruction() {
  const { pattern, setPattern, changePatternSentence } = usePattern();
  const { patterns } = usePatterns();

  const selectPattern = (id: number): void => {
    const selectedPattern: Pattern | undefined = patterns.find(
      (pat) => pat.id === id,
    );
    if (selectedPattern) {
      setPattern(selectedPattern);
    }
  };

  return (
    <div>
      <PatternChoices patterns={patterns} selectPattern={selectPattern} />
      <PatternInputComponent
        pattern={pattern}
        changePatternSentence={changePatternSentence}
      />
    </div>
  );
}
