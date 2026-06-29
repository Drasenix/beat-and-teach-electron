import { useState } from 'react';
import { DEFAULT_PATTERN, Pattern } from '../models/pattern-model';
import { flatTokenCount } from '../utils/pattern-parser';

const usePattern = () => {
  const [pattern, setPattern] = useState<Pattern>(DEFAULT_PATTERN);

  const changeSentence = (index: number, value: string) => {
    const sentences = [...pattern.sentences];
    const highlights = [...pattern.highlights];

    sentences[index] = value;

    const newFlatCount = flatTokenCount(value);
    const existingHighlights = highlights[index] ?? [];
    if (existingHighlights.length < newFlatCount) {
      highlights[index] = [
        ...existingHighlights,
        ...Array(newFlatCount - existingHighlights.length).fill(null),
      ];
    } else {
      highlights[index] = existingHighlights.slice(0, newFlatCount);
    }

    setPattern({
      ...pattern,
      sentences,
      highlights,
    });
  };

  const addSentence = () => {
    setPattern({
      ...pattern,
      sentences: [...pattern.sentences, ''],
      highlights: [...pattern.highlights, []],
    });
  };

  const removeSentence = (index: number) => {
    setPattern({
      ...pattern,
      sentences: pattern.sentences.filter((_, i) => i !== index),
      highlights: pattern.highlights.filter((_, i) => i !== index),
    });
  };

  const changeHighlight = (
    sentenceIndex: number,
    tokenIndex: number,
    color: string | null,
  ) => {
    const highlights = pattern.highlights.map((row, i) =>
      i === sentenceIndex
        ? row.map((c, j) => (j === tokenIndex ? color : c))
        : row,
    );
    setPattern({ ...pattern, highlights });
  };

  const resetPattern = () => {
    setPattern(DEFAULT_PATTERN);
  };

  return {
    pattern,
    setPattern,
    changeSentence,
    addSentence,
    removeSentence,
    changeHighlight,
    resetPattern,
  };
};

export default usePattern;
