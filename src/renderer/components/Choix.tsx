import { useEffect, useState } from 'react';
import Pattern from '../../services/features/pattern/pattern-model';
import getAllPaterns from '../../services/features/pattern/pattern-service';

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
    setPattern(event.target.value);
  };

  const selectPattern = (id: string): void => {
    const selectedPattern: Pattern | undefined = patterns.find(
      (p) => p.getId() === id,
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
            <li key={pat.getId()}>
              <button type="button" onClick={() => selectPattern(pat.getId())}>
                {pat.getName()}
              </button>
            </li>
          );
        })}
      </ul>
      {pattern && (
        <textarea
          value={pattern.getSentence()}
          onChange={changePatternSentence}
        />
      )}
    </div>
  );
}
