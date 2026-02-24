import { useEffect, useState } from 'react';
import Pattern from '../../services/features/pattern/pattern-model';
import getAllPaterns from '../../services/features/pattern/pattern-service';

export default function Choix() {
  const [pattern, setPattern] = useState<string>('inital');
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

  return (
    <div>
      <div>Choix</div>
      <ul>
        {patterns.map((pat) => {
          return (
            <li key={pat.getId()}>
              {pat.getName()}: {pat.getSentence()}
            </li>
          );
        })}
      </ul>
      <div>{pattern}</div>
      <textarea value={pattern} onChange={changePatternSentence} />
    </div>
  );
}
