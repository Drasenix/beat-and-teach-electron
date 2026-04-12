import { useState, useMemo } from 'react';
import usePattern from './usePattern';
import { transformSentencesWithMute } from '../utils/pattern-mute';

const usePatternSession = () => {
  const patternHooks = usePattern();
  const [mutedSteps, setMutedSteps] = useState<Set<string>>(new Set());

  const setPattern = (
    newPattern: Parameters<typeof patternHooks.setPattern>[0],
  ) => {
    patternHooks.setPattern(newPattern);
    setMutedSteps(new Set());
  };

  const resetPattern = () => {
    patternHooks.resetPattern();
    setMutedSteps(new Set());
  };

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

  const sentencesForPlayback = useMemo(
    () =>
      transformSentencesWithMute(patternHooks.pattern.sentences, mutedSteps),
    [patternHooks.pattern.sentences, mutedSteps],
  );

  return {
    ...patternHooks,
    setPattern,
    resetPattern,
    mutedSteps,
    toggleMute,
    isMuted,
    sentencesForPlayback,
  };
};

export default usePatternSession;
