import { useState } from 'react';
import { PatternFormValues } from '../types/pattern-types';
import { normalizeSentences, flatTokenCount } from '../utils/pattern-parser';

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

  const handleNormalize = () => {
    const normalized = normalizeSentences(patternValues.sentences);
    if (normalized.some((s, i) => s !== patternValues.sentences[i])) {
      setPatternValues((prev) => ({
        ...prev,
        sentences: normalized,
        highlights: normalized.map((s, i) =>
          i === 0 ? prev.highlights[0] : buildDefaultHighlights(s),
        ),
      }));
    }
  };

  return { patternValues, handlePatternChange, handleNormalize };
};

export default usePatternForm;
