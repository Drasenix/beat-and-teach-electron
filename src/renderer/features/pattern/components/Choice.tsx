import { useEffect, useState } from 'react';
import { Pattern } from '../models/pattern-model';
import PatternComponent from './Pattern';
import getAllPaterns from '../services/pattern-service';
import usePattern from '../hooks/usePattern';

export default function Choix() {
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
      <h2>Tes Exemples</h2>
      <div>
        <ul>
          {patterns.map((pat) => {
            return (
              <li key={pat.id}>
                <button type="button" onClick={() => selectPattern(pat.id)}>
                  {pat.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <PatternComponent
        pattern={pattern}
        changePatternSentence={changePatternSentence}
      />
    </div>
  );
}
