import { useEffect, useState } from 'react';
import Pattern from '../services/features/pattern/pattern-model';
import getAllPaterns from '../services/features/pattern/pattern-service';
import playSentence from '../services/features/audio/audio-service';

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
      setPattern(
        new Pattern(pattern.getId(), pattern.getName(), event.target.value),
      );
    }
  };

  const selectPattern = (id: string): void => {
    const selectedPattern: Pattern | undefined = patterns.find(
      (p) => p.getId() === id,
    );
    if (selectedPattern) {
      setPattern(selectedPattern);
    }
  };

  const playPattern = (): void => {
    if (pattern) {
      playSentence(pattern.getSentence());
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
        <div>
          <textarea
            value={pattern.getSentence()}
            onChange={changePatternSentence}
          />
          <button type="button" onClick={playPattern}>
            Ecouter
          </button>
        </div>
      )}
    </div>
  );
}
