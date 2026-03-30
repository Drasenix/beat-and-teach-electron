import { PatternStep } from '../types/pattern-types';
import { TrackColumn } from '../types/track-column';

const SENTENCE_REGEX = /\(([^)]*)\)|(\S+)/g;

function execAll(sentence: string): RegExpExecArray[] {
  const regex = new RegExp(SENTENCE_REGEX.source, SENTENCE_REGEX.flags);
  const matches: RegExpExecArray[] = [];
  let match = regex.exec(sentence);
  while (match !== null) {
    matches.push(match);
    match = regex.exec(sentence);
  }
  return matches;
}

export function createStep(
  symbol: string,
  validSymbols: string[],
  id: number,
): PatternStep {
  return {
    id: `step-${id}`,
    symbol,
    valid: validSymbols.includes(symbol),
    isGroup: false,
  };
}

export function createGroup(
  raw: string,
  symbols: string[],
  startId: number,
): PatternStep {
  const inner = raw
    .trim()
    .split(/\s+/)
    .map((s, i) => createStep(s, symbols, startId + i));
  return {
    id: `group-${startId + inner.length}`,
    symbol: `(${raw})`,
    valid: inner.every((t) => t.valid),
    isGroup: true,
    steps: inner,
  };
}

export function parseSteps(
  sentence: string,
  validSymbols: string[],
): PatternStep[] {
  return execAll(sentence).map((match, counter) => {
    if (match[1] !== undefined) {
      return createGroup(match[1], validSymbols, counter);
    }
    return createStep(match[2], validSymbols, counter);
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

function buildFlatTokenIndices(track: PatternStep[]): number[] {
  let counter = 0;
  return track.map((step) => {
    const index = counter;
    counter += getFlatTokenCount(step);
    return index;
  });
}

export function parseMultiTrackSteps(
  sentences: string[],
  validSymbols: string[],
): TrackColumn[] {
  const tracks: PatternStep[][] = sentences.map((sentence) =>
    parseSteps(sentence, validSymbols),
  );
  const flatIndices: number[][] = tracks.map(buildFlatTokenIndices);
  const maxLength = Math.max(...tracks.map((track) => track.length), 0);

  return Array.from({ length: maxLength }).map((_, colIndex) => ({
    id: `col-${colIndex}`,
    steps: tracks.map((track, sentenceIndex) => ({
      step: track[colIndex] ?? null,
      sentenceIndex,
      tokenIndex: flatIndices[sentenceIndex]?.[colIndex] ?? -1,
    })),
  }));
}

export function countSentenceSteps(sentence: string): number {
  return execAll(sentence).length;
}

function tokenize(sentence: string): string[] {
  return sentence.trim().split(/\s+/);
}

function collectGroup(
  tokens: string[],
  startIndex: number,
): { group: string; nextIndex: number } {
  const parts: string[] = [];
  let i = startIndex;
  while (i < tokens.length) {
    parts.push(tokens[i]);
    if (tokens[i].endsWith(')')) {
      i += 1;
      break;
    }
    i += 1;
  }
  return { group: parts.join(' '), nextIndex: i };
}

function collectTokensUpTo(tokens: string[], targetLength: number): string[] {
  const kept: string[] = [];
  let i = 0;
  while (i < tokens.length && kept.length < targetLength) {
    if (tokens[i].startsWith('(')) {
      const { group, nextIndex } = collectGroup(tokens, i);
      kept.push(group);
      i = nextIndex;
    } else {
      kept.push(tokens[i]);
      i += 1;
    }
  }
  return kept;
}

function padWithSilence(tokens: string[], targetLength: number): string[] {
  const padding = Array(targetLength - tokens.length).fill('.');
  return [...tokens, ...padding];
}

function normalizeSentence(sentence: string, targetLength: number): string {
  const tokens = tokenize(sentence);
  const collected = collectTokensUpTo(tokens, targetLength);
  const padded = padWithSilence(collected, targetLength);
  const trailingSpace = sentence.endsWith(' ') ? ' ' : '';
  return padded.join(' ') + trailingSpace;
}

export function normalizeSentences(sentences: string[]): string[] {
  if (sentences.length === 0) return sentences;
  const targetLength = countSentenceSteps(sentences[0]);
  return sentences.map((sentence, index) => {
    if (index === 0) return sentence;
    return normalizeSentence(sentence, targetLength);
  });
}
