import { PatternStep } from '../types/pattern-types';
import { tokenizeSentence } from '../../../utils/sentence-tokenizer';
import { parseToken } from '../../../utils/token-parser';

export function createStep(
  raw: string,
  validSymbols: string[],
  id: number,
): PatternStep {
  const { symbol, frequency } = parseToken(raw);
  const step: PatternStep = {
    id: `step-${id}`,
    symbol,
    valid: validSymbols.includes(symbol),
    isGroup: false,
  };
  if (frequency !== undefined) {
    step.frequency = frequency;
  }
  return step;
}

export function createGroup(
  raw: string,
  symbols: string[],
  startId: number,
): PatternStep {
  const innerTokens = raw.trim().split(/\s+/);
  const inner = innerTokens.map((s, i) => createStep(s, symbols, startId + i));
  const displaySymbols = innerTokens.map((s) => parseToken(s).symbol).join(' ');
  return {
    id: `group-${startId + inner.length}`,
    symbol: `(${displaySymbols})`,
    valid: inner.every((t) => t.valid),
    isGroup: true,
    steps: inner,
  };
}

export function parseSteps(
  sentence: string,
  validSymbols: string[],
): PatternStep[] {
  return tokenizeSentence(sentence).map((token, counter) => {
    if (token.group !== undefined) {
      return createGroup(token.group, validSymbols, counter);
    }
    return createStep(token.symbol ?? '', validSymbols, counter);
  });
}

export function flatTokenCount(sentence: string): number {
  return sentence
    .trim()
    .replace(/[()]/g, '')
    .split(/\s+/)
    .filter((t) => t.length > 0).length;
}

function getFlatTokenCount(step: PatternStep): number {
  if (step.isGroup && step.steps) return step.steps.length;
  return 1;
}

export function buildFlatTokenIndices(track: PatternStep[]): number[] {
  let counter = 0;
  return track.map((step) => {
    const index = counter;
    counter += getFlatTokenCount(step);
    return index;
  });
}

export function countSentenceSteps(sentence: string): number {
  return tokenizeSentence(sentence).length;
}
