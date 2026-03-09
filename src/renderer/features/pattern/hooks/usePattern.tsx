import { useState } from 'react';
import { DEFAULT_PATTERN, Pattern } from '../models/pattern-model';

const usePattern = () => {
  const [pattern, setPattern] = useState<Pattern>(DEFAULT_PATTERN);

  const changePatternSentence = (event: any) => {
    setPattern({
      id: pattern.id,
      slug: pattern.slug,
      name: pattern.name,
      sentence: event.target.value,
    });
  };

  return { pattern, setPattern, changePatternSentence };
};

export default usePattern;
