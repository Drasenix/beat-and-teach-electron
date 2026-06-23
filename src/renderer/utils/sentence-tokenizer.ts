import { parseToken } from './token-parser';

const SENTENCE_REGEX = /\(([^)]*)\)|(\S+)/g;

export interface TokenMatch {
  group: string | undefined;
  symbol: string | undefined;
  fullMatch: string;
}

export function tokenizeSentence(sentence: string): TokenMatch[] {
  const regex = new RegExp(SENTENCE_REGEX.source, SENTENCE_REGEX.flags);
  const matches: TokenMatch[] = [];
  let match = regex.exec(sentence);
  while (match !== null) {
    matches.push({
      group: match[1] !== undefined ? match[1] : undefined,
      symbol: match[2],
      fullMatch: match[0],
    });
    match = regex.exec(sentence);
  }
  return matches;
}

export function extractSymbols(sentence: string): string[] {
  const symbols: string[] = [];
  const tokens = tokenizeSentence(sentence);
  tokens.forEach((token) => {
    if (token.group !== undefined) {
      token.group
        .split(/\s+/)
        .forEach((s) => symbols.push(parseToken(s).symbol));
    } else if (token.symbol !== undefined) {
      symbols.push(parseToken(token.symbol).symbol);
    }
  });
  return symbols;
}

export function extractUniqueSymbols(sentences: string[]): string[] {
  const all: string[] = [];
  sentences.forEach((s) => extractSymbols(s).forEach((sym) => all.push(sym)));
  return [...new Set(all)];
}
