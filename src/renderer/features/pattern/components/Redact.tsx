import { useState } from 'react';
import PatternComponent from './Pattern';
import { Pattern, getDefaultPattern } from '../models/pattern-model';

export default function Redact() {
  const [pattern, setPattern] = useState<Pattern>(getDefaultPattern());
  const legende: string =
    'Rédigez votre pattern en marquant les silences par des points .';

  const changePatternSentence = (event: any) => {
    if (pattern) {
      setPattern({
        id: pattern.id,
        name: pattern.name,
        sentence: event.target.value,
      });
    }
  };

  return (
    <div>
      <h2>{legende}</h2>
      <PatternComponent
        pattern={pattern}
        changePatternSentence={changePatternSentence}
      />
    </div>
  );
}
