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

  it('should tokenize a sentence with @freq notation', () => {
    const result = tokenizeSentence('Hum@440 P');
    expect(result).toHaveLength(2);
    expect(result[0].symbol).toBe('Hum@440');
    expect(result[1].symbol).toBe('P');
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

  it('should strip @freq from atomic tokens', () => {
    const result = extractSymbols('Hum@440 P@220');
    expect(result).toEqual(['Hum', 'P']);
  });

  it('should strip @freq from tokens inside groups', () => {
    const result = extractSymbols('P (Hum@440 Ts@880) .');
    expect(result).toEqual(['P', 'Hum', 'Ts', '.']);
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

  it('should strip @freq and deduplicate cleaned symbols', () => {
    const result = extractUniqueSymbols(['Hum@440 P', 'Hum@880 Ts']);
    expect(result).toContain('Hum');
    expect(result).toContain('P');
    expect(result).toContain('Ts');
    expect(result).not.toContain('Hum@440');
    expect(result).not.toContain('Hum@880');
  });
});
