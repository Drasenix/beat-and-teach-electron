import { useState } from 'react';
import { DEFAULT_PATTERN, Pattern } from '../models/pattern-model';
import {
  countSentenceSteps,
  normalizeSentences,
} from '../utils/pattern-parser';

const usePattern = () => {
  const [pattern, setPattern] = useState<Pattern>(DEFAULT_PATTERN);

  const changePatternSentence = (index: number, value: string) => {
    const next = [...pattern.sentences];

    if (index !== 0) {
      const targetLength = countSentenceSteps(pattern.sentences[0]);
      const currentLength = countSentenceSteps(value);
      if (currentLength > targetLength) return;
    }

    next[index] = value;
    const normalized = index === 0 ? normalizeSentences(next) : next;
    setPattern({ ...pattern, sentences: normalized });
  };

  const addSentence = () => {
    const reference = pattern.sentences[0]?.trim().split(/\s+/) ?? [];
    const empty =
      reference.length > 0 ? Array(reference.length).fill('.').join(' ') : '';
    setPattern({ ...pattern, sentences: [...pattern.sentences, empty] });
  };

  const removeSentence = (index: number) => {
    const next = pattern.sentences.filter((_, i) => i !== index);
    setPattern({ ...pattern, sentences: next });
  };

  const normalizeAllSentences = () => {
    const normalized = normalizeSentences(pattern.sentences);
    if (normalized.some((s, i) => s !== pattern.sentences[i])) {
      setPattern({ ...pattern, sentences: normalized });
    }
  };

  return {
    pattern,
    setPattern,
    changePatternSentence,
    addSentence,
    removeSentence,
    normalizeAllSentences,
  };
};

export default usePattern;
