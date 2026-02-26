import { useEffect, useState } from 'react';
import Pattern from '../features/pattern/pattern-model';
import getAllPaterns from '../features/pattern/pattern-service';
import PatternComponent from '../features/pattern/Pattern';

export default function Choix() {
  const [pattern, setPattern] = useState<Pattern>();
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
      {pattern && (
        <PatternComponent
          pattern={pattern}
          selectPattern={changePatternSentence}
        />
      )}
    </div>
  );
}
