import {
  tokenizeSentence,
  extractSymbols,
  extractUniqueSymbols,
} from './sentence-tokenizer';

describe('#tokenizeSentence', () => {
  it('should return empty array for empty string', () => {
    const result = tokenizeSentence('');
    expect(result).toEqual([]);
  });

  it('should tokenize a simple sentence with single symbols', () => {
    const result = tokenizeSentence('P Ts K');
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      group: undefined,
      symbol: 'P',
      fullMatch: 'P',
    });
    expect(result[1]).toEqual({
      group: undefined,
      symbol: 'Ts',
      fullMatch: 'Ts',
    });
    expect(result[2]).toEqual({
      group: undefined,
      symbol: 'K',
      fullMatch: 'K',
    });
  });

  it('should tokenize a sentence with a group', () => {
    const result = tokenizeSentence('P (Ts K) .');
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      group: undefined,
      symbol: 'P',
      fullMatch: 'P',
    });
    expect(result[1]).toEqual({
      group: 'Ts K',
      symbol: undefined,
      fullMatch: '(Ts K)',
    });
    expect(result[2]).toEqual({
      group: undefined,
      symbol: '.',
      fullMatch: '.',
    });
  });

  it('should tokenize a sentence with multiple groups', () => {
    const result = tokenizeSentence('(P Ts) K (. Bw)');
    expect(result).toHaveLength(3);
    expect(result[0].group).toBe('P Ts');
    expect(result[1].symbol).toBe('K');
    expect(result[2].group).toBe('. Bw');
  });

  it('should handle trailing spaces', () => {
    const result = tokenizeSentence('P Ts ');
    expect(result).toHaveLength(2);
  });
});

describe('#extractSymbols', () => {
  it('should return empty array for empty string', () => {
    const result = extractSymbols('');
    expect(result).toEqual([]);
  });

  it('should extract symbols from a simple sentence', () => {
    const result = extractSymbols('P Ts K');
    expect(result).toEqual(['P', 'Ts', 'K']);
  });

  it('should extract symbols from inside groups', () => {
    const result = extractSymbols('P (Ts K) .');
    expect(result).toEqual(['P', 'Ts', 'K', '.']);
  });

  it('should extract symbols from multiple groups', () => {
    const result = extractSymbols('(P Ts) K (. Bw)');
    expect(result).toEqual(['P', 'Ts', 'K', '.', 'Bw']);
  });
});

describe('#extractUniqueSymbols', () => {
  it('should return empty array for empty sentences', () => {
    const result = extractUniqueSymbols([]);
    expect(result).toEqual([]);
  });

  it('should return symbols from a single sentence', () => {
    const result = extractUniqueSymbols(['P Ts K']);
    expect(result).toHaveLength(3);
    expect(result).toContain('P');
    expect(result).toContain('Ts');
    expect(result).toContain('K');
  });

  it('should deduplicate symbols across sentences', () => {
    const result = extractUniqueSymbols(['P Ts', 'K P']);
    expect(result).toHaveLength(3);
    expect(result).toContain('P');
    expect(result).toContain('Ts');
    expect(result).toContain('K');
  });

  it('should extract symbols from groups', () => {
    const result = extractUniqueSymbols(['(Ts P) K']);
    expect(result).toContain('Ts');
    expect(result).toContain('P');
    expect(result).toContain('K');
  });

  it('should handle multiple sentences with groups', () => {
    const result = extractUniqueSymbols(['P (Ts K)', '(. Bw) Pf']);
    expect(result).toContain('P');
    expect(result).toContain('Ts');
    expect(result).toContain('K');
    expect(result).toContain('.');
    expect(result).toContain('Bw');
    expect(result).toContain('Pf');
  });
});
