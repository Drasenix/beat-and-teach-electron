import { useState } from 'react';
import { PatternFormValues } from '../types/pattern-types';
import { normalizeSentences } from '../utils/pattern-parser';

const usePatternForm = (initialValues: PatternFormValues) => {
  const [patternValues, setPatternValues] =
    useState<PatternFormValues>(initialValues);

  const handlePatternChange = (partial: Partial<PatternFormValues>) => {
    setPatternValues((prev) => ({ ...prev, ...partial }));
  };

  const handleNormalize = () => {
    const normalized = normalizeSentences(patternValues.sentences);
    if (normalized.some((s, i) => s !== patternValues.sentences[i])) {
      setPatternValues((prev) => ({ ...prev, sentences: normalized }));
    }
  };

  return { patternValues, handlePatternChange, handleNormalize };
};

export default usePatternForm;
