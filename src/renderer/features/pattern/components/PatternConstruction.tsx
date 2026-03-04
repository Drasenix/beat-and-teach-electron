import { useEffect, useState } from 'react';
import { Pattern } from '../models/pattern-model';
import PatternInputComponent from './PatternInput';
import getAllPaterns from '../services/pattern-service';
import usePattern from '../hooks/usePattern';
import PatternChoices from './PatternChoices';

export default function PatternConstruction() {
  const { pattern, setPattern, changePatternSentence } = usePattern();
  const [patterns, setPatterns] = useState<Pattern[]>([]);

  useEffect(() => {
    const fetchPattern = async () => {
      const allPatterns: Pattern[] = await getAllPaterns();
      setPatterns(allPatterns);
    };

    fetchPattern();
  }, []);

  const selectPattern = (id: string): void => {
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
