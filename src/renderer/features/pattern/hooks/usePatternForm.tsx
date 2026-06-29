import { useState } from 'react';
import { PatternFormValues } from '../types/pattern-types';
import { flatTokenCount } from '../utils/pattern-parser';

const usePatternForm = (initialValues: PatternFormValues) => {
  const [patternValues, setPatternValues] =
    useState<PatternFormValues>(initialValues);

  const buildDefaultHighlights = (sentence: string): (string | null)[] =>
    Array(flatTokenCount(sentence)).fill(null);

  const handlePatternChange = (partial: Partial<PatternFormValues>) => {
    setPatternValues((prev) => {
      const next = { ...prev, ...partial };
      if (partial.sentences) {
        next.highlights = partial.sentences.map(
          (s, i) => prev.highlights[i] ?? buildDefaultHighlights(s),
        );
      }
      return next;
    });
  };

  return { patternValues, handlePatternChange };
};

export default usePatternForm;
