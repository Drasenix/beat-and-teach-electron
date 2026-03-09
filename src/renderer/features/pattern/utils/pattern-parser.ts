import { PatternToken } from '../types/pattern-token';

export function createToken(
  symbol: string,
  validSymbols: string[],
  id: number,
): PatternToken {
  return {
    id: `token-${id}`,
    symbol,
    valid: validSymbols.includes(symbol),
    isGroup: false,
  };
}

export function createGroup(
  raw: string,
  symbols: string[],
  startId: number,
): PatternToken {
  const inner = raw
    .trim()
    .split(/\s+/)
    .map((s, i) => createToken(s, symbols, startId + i));
  return {
    id: `group-${startId + inner.length}`,
    symbol: `(${raw})`,
    valid: inner.every((t) => t.valid),
    isGroup: true,
    tokens: inner,
  };
}

export function parseTokens(
  sentence: string,
  validSymbols: string[],
): PatternToken[] {
  const regex = /\(([^)]*)\)|(\S+)/g;
  const tokens: PatternToken[] = [];
  let counter = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(sentence)) !== null) {
    if (match[1] !== undefined) {
      tokens.push(createGroup(match[1], validSymbols, counter));
    } else {
      tokens.push(createToken(match[2], validSymbols, counter));
    }
    counter++;
  }

  return tokens;
}
