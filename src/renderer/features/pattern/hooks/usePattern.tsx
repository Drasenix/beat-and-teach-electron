import { useState } from 'react';
import { getDefaultPattern, Pattern } from '../models/pattern-model';

const usePattern = () => {
  const [pattern, setPattern] = useState<Pattern>(getDefaultPattern());

  const changePatternSentence = (event: any) => {
    setPattern({
      id: pattern.id,
      name: pattern.name,
      sentence: event.target.value,
    });
  };

  return { pattern, setPattern, changePatternSentence };
};

export default usePattern;
