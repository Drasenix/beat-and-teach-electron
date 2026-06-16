import { tokenizeSentence } from '../../../utils/sentence-tokenizer';

export function transformSentencesWithMute(
  sentences: string[],
  mutedSteps: Set<string>,
): string[] {
  if (mutedSteps.size === 0) return sentences;

  return sentences.map((sentence, sentenceIndex) => {
    const tokens = tokenizeSentence(sentence);
    const parts: string[] = [];
    let tokenIndex = 0;

    tokens.forEach((token) => {
      if (token.group !== undefined) {
        const symbols = token.group.trim().split(/\s+/);
        const transformed: string[] = [];
        symbols.forEach((sym) => {
          const key = `${sentenceIndex}-${tokenIndex}`;
          tokenIndex += 1;
          transformed.push(mutedSteps.has(key) ? '.' : sym);
        });
        parts.push(`(${transformed.join(' ')})`);
      } else {
        const key = `${sentenceIndex}-${tokenIndex}`;
        tokenIndex += 1;
        parts.push(mutedSteps.has(key) ? '.' : (token.symbol ?? ''));
      }
    });

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
