import { useState, useMemo, useCallback } from 'react';
import usePattern from './usePattern';
import { Pattern, DEFAULT_PATTERN } from '../models/pattern-model';
import { transformSentencesWithMute } from '../utils/pattern-mute';
import updateTokenFrequency from '../../../utils/update-token-frequency';

const usePatternSession = () => {
  const patternHooks = usePattern();
  const { pattern, changeSentence } = patternHooks;
  const [mutedSteps, setMutedSteps] = useState<Set<string>>(new Set());
  const [lastSavedSnapshot, setLastSavedSnapshot] = useState<string>(() =>
    JSON.stringify({
      name: DEFAULT_PATTERN.name,
      sentences: DEFAULT_PATTERN.sentences,
      highlights: DEFAULT_PATTERN.highlights,
    }),
  );

  const takeSnapshot = useCallback((p: Pattern): void => {
    setLastSavedSnapshot(
      JSON.stringify({
        name: p.name,
        sentences: p.sentences,
        highlights: p.highlights,
      }),
    );
  }, []);

  const isDirty = useMemo(() => {
    const current = JSON.stringify({
      name: pattern.name,
      sentences: pattern.sentences,
      highlights: pattern.highlights,
    });
    return current !== lastSavedSnapshot;
  }, [pattern, lastSavedSnapshot]);

  const setPattern = (newPattern: Pattern): void => {
    patternHooks.setPattern(newPattern);
    takeSnapshot(newPattern);
    setMutedSteps(new Set());
  };

  const resetPattern = () => {
    patternHooks.resetPattern();
    takeSnapshot(DEFAULT_PATTERN);
    setMutedSteps(new Set());
  };

  const markAsSaved = useCallback((): void => {
    takeSnapshot(pattern);
  }, [takeSnapshot, pattern]);

  const toggleMute = (sentenceIndex: number, tokenIndex: number) => {
    const key = `${sentenceIndex}-${tokenIndex}`;
    setMutedSteps((prev) => {
      const newMuted = new Set(prev);
      if (newMuted.has(key)) {
        newMuted.delete(key);
      } else {
        newMuted.add(key);
      }
      return newMuted;
    });
  };

  const isMuted = (sentenceIndex: number, tokenIndex: number): boolean => {
    return mutedSteps.has(`${sentenceIndex}-${tokenIndex}`);
  };

  const changeFrequency = useCallback(
    (sentenceIndex: number, tokenIndex: number, frequency: number | null) => {
      const currentSentence = pattern.sentences[sentenceIndex];
      if (currentSentence === undefined) return;
      const newSentence = updateTokenFrequency(
        currentSentence,
        tokenIndex,
        frequency,
      );
      changeSentence(sentenceIndex, newSentence);
    },
    [pattern.sentences, changeSentence],
  );

  const sentencesForPlayback = useMemo(
    () => transformSentencesWithMute(pattern.sentences, mutedSteps),
    [pattern.sentences, mutedSteps],
  );

  return {
    ...patternHooks,
    setPattern,
    resetPattern,
    mutedSteps,
    toggleMute,
    isMuted,
    changeFrequency,
    sentencesForPlayback,
    isDirty,
    markAsSaved,
  };
};

export default usePatternSession;
