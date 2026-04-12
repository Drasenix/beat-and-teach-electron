export function transformSentencesWithMute(
  sentences: string[],
  mutedSteps: Set<string>,
): string[] {
  if (mutedSteps.size === 0) return sentences;

  const regex = /\(([^)]*)\)|(\S+)/g;

  return sentences.map((sentence, sentenceIndex) => {
    const parts: string[] = [];
    let match = regex.exec(sentence);
    let tokenIndex = 0;

    while (match !== null) {
      if (match[1] !== undefined) {
        const symbols = match[1].trim().split(/\s+/);
        const transformed: string[] = [];
        let i = 0;
        while (i < symbols.length) {
          const key = `${sentenceIndex}-${tokenIndex}`;
          tokenIndex += 1;
          transformed.push(mutedSteps.has(key) ? '.' : symbols[i]);
          i += 1;
        }
        parts.push(`(${transformed.join(' ')})`);
      } else {
        const key = `${sentenceIndex}-${tokenIndex}`;
        tokenIndex += 1;
        parts.push(mutedSteps.has(key) ? '.' : match[2]);
      }

      match = regex.exec(sentence);
    }

    return parts.join(' ');
  });
}

export function createMuteKey(
  sentenceIndex: number,
  tokenIndex: number,
): string {
  return `${sentenceIndex}-${tokenIndex}`;
}

export function isStepMuted(
  sentenceIndex: number,
  tokenIndex: number,
  mutedSteps: Set<string>,
): boolean {
  return mutedSteps.has(createMuteKey(sentenceIndex, tokenIndex));
}

export function toggleMute(
  sentenceIndex: number,
  tokenIndex: number,
  mutedSteps: Set<string>,
): Set<string> {
  const key = createMuteKey(sentenceIndex, tokenIndex);
  const newMuted = new Set(mutedSteps);
  if (newMuted.has(key)) {
    newMuted.delete(key);
  } else {
    newMuted.add(key);
  }
  return newMuted;
}
