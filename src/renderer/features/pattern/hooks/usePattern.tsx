import { useState } from 'react';
import { DEFAULT_PATTERN, Pattern } from '../models/pattern-model';
import {
  countSentenceSteps,
  normalizeSentences,
  flatTokenCount,
} from '../utils/pattern-parser';

const usePattern = () => {
  const [pattern, setPattern] = useState<Pattern>(DEFAULT_PATTERN);

  const buildDefaultHighlights = (sentence: string): (string | null)[] =>
    Array(flatTokenCount(sentence)).fill(null);

  const changeSentence = (index: number, value: string) => {
    const sentences = [...pattern.sentences];
    const highlights = [...pattern.highlights];

    if (index !== 0) {
      const targetLength = countSentenceSteps(pattern.sentences[0]);
      const currentLength = countSentenceSteps(value);
      if (currentLength > targetLength) return;
    }

    sentences[index] = value;

    // Conserver les highlights existants, compléter ou tronquer si nécessaire
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

    const normalized = index === 0 ? normalizeSentences(sentences) : sentences;
    const normalizedHighlights =
      index === 0
        ? normalized.map((s, i) => {
            if (i === 0) return highlights[0];
            const count = flatTokenCount(s);
            const existing = highlights[i] ?? [];
            if (existing.length < count) {
              return [
                ...existing,
                ...Array(count - existing.length).fill(null),
              ];
            }
            return existing.slice(0, count);
          })
        : highlights;

    setPattern({
      ...pattern,
      sentences: normalized,
      highlights: normalizedHighlights,
    });
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
      highlights: [
        ...pattern.highlights,
        buildDefaultHighlights(newEmptySentence),
      ],
    });
  };

  const removeSentence = (index: number) => {
    setPattern({
      ...pattern,
      sentences: pattern.sentences.filter((_, i) => i !== index),
      highlights: pattern.highlights.filter((_, i) => i !== index),
    });
  };

  const normalizeAllSentences = () => {
    const normalized = normalizeSentences(pattern.sentences);
    if (normalized.some((s, i) => s !== pattern.sentences[i])) {
      setPattern({
        ...pattern,
        sentences: normalized,
        highlights: normalized.map((s, i) =>
          i === 0 ? pattern.highlights[0] : buildDefaultHighlights(s),
        ),
      });
    }
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

  return {
    pattern,
    setPattern,
    changeSentence,
    addSentence,
    removeSentence,
    normalizeAllSentences,
    changeHighlight,
  };
};

export default usePattern;
