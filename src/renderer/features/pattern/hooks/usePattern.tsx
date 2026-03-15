import { useState } from 'react';
import { DEFAULT_PATTERN, Pattern } from '../models/pattern-model';
import {
  countSentenceSteps,
  normalizeSentences,
} from '../utils/pattern-parser';

const usePattern = () => {
  const [pattern, setPattern] = useState<Pattern>(DEFAULT_PATTERN);

  const changeSentence = (index: number, value: string) => {
    const sentences = [...pattern.sentences];

    if (index !== 0) {
      const targetLength = countSentenceSteps(pattern.sentences[0]);
      const currentLength = countSentenceSteps(value);
      if (currentLength > targetLength) return;
    }

    sentences[index] = value;
    const normalized = index === 0 ? normalizeSentences(sentences) : sentences;
    setPattern({ ...pattern, sentences: normalized });
  };

  const addSentence = () => {
    const firstSentence = pattern.sentences[0]?.trim().split(/\s+/) ?? [];
    const newEmptySentence =
      firstSentence.length > 0
        ? Array(firstSentence.length).fill('.').join(' ')
        : '';
    setPattern({
      ...pattern,
      sentences: [...pattern.sentences, newEmptySentence],
    });
  };

  const removeSentence = (index: number) => {
    const newSentences: string[] = pattern.sentences.filter(
      (_, i) => i !== index,
    );
    setPattern({ ...pattern, sentences: newSentences });
  };

  const normalizeAllSentences = () => {
    const normalized: string[] = normalizeSentences(pattern.sentences);
    if (normalized.some((s, i) => s !== pattern.sentences[i])) {
      setPattern({ ...pattern, sentences: normalized });
    }
  };

  return {
    pattern,
    setPattern,
    changeSentence,
    addSentence,
    removeSentence,
    normalizeAllSentences,
  };
};

export default usePattern;
