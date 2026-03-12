import { PatternStep } from '../types/pattern-types';

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
  const regex = /\(([^)]*)\)|(\S+)/g;
  const steps: PatternStep[] = [];
  let counter = 0;
  let match: RegExpExecArray | null = regex.exec(sentence);

  while (match !== null) {
    if (match[1] !== undefined) {
      steps.push(createGroup(match[1], validSymbols, counter));
    } else {
      steps.push(createStep(match[2], validSymbols, counter));
    }
    counter += 1;
    match = regex.exec(sentence);
  }

  return steps;
}
