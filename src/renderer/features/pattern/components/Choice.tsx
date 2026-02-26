import { useEffect, useState } from 'react';
import { getDefaultPattern, Pattern } from '../models/pattern-model';
import PatternComponent from './Pattern';
import getAllPaterns from '../services/pattern-service';

export default function Choix() {
  const [pattern, setPattern] = useState<Pattern>(getDefaultPattern());
  const [patterns, setPatterns] = useState<Pattern[]>([]);

  useEffect(() => {
    const fetchPattern = async () => {
      const allPatterns: Pattern[] = await getAllPaterns();
      setPatterns(allPatterns);
    };

    fetchPattern();
  }, []);

  const changePatternSentence = (event: any) => {
    if (pattern) {
      setPattern({
        id: pattern.id,
        name: pattern.name,
        sentence: event.target.value,
      });
    }
  };

  const selectPattern = (id: string): void => {
    const selectedPattern: Pattern | undefined = patterns.find(
      (p) => p.id === id,
    );
    if (selectedPattern) {
      setPattern(selectedPattern);
    }
  };

  return (
    <div>
      <div>Choix</div>
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
      <PatternComponent
        pattern={pattern}
        changePatternSentence={changePatternSentence}
      />
    </div>
  );
}
