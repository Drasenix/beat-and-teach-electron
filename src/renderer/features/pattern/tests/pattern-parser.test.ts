import {
  createStep,
  createGroup,
  parseSteps,
  countSentenceSteps,
  normalizeSentences,
  parseMultiTrackSteps,
  flatTokenCount,
} from '../utils/pattern-parser';

describe('#createStep', () => {
  it('should create a valid step when symbol exists', () => {
    const result = createStep('P', ['P', 'Ts', 'K'], 0);
    expect(result).toEqual({
      id: 'step-0',
      symbol: 'P',
      valid: true,
      isGroup: false,
    });
  });

  it('should create an invalid step when symbol does not exist', () => {
    const result = createStep('X', ['P', 'Ts', 'K'], 1);
    expect(result).toEqual({
      id: 'step-1',
      symbol: 'X',
      valid: false,
      isGroup: false,
    });
  });
});

describe('#createGroup', () => {
  it('should create a valid group when all symbols exist', () => {
    const result = createGroup('Ts P', ['P', 'Ts', 'K'], 0);
    expect(result.isGroup).toBe(true);
    expect(result.valid).toBe(true);
    expect(result.steps).toHaveLength(2);
    expect(result.steps?.[0].symbol).toBe('Ts');
    expect(result.steps?.[1].symbol).toBe('P');
  });

  it('should create an invalid group when one symbol does not exist', () => {
    const result = createGroup('Ts X', ['P', 'Ts', 'K'], 0);
    expect(result.isGroup).toBe(true);
    expect(result.valid).toBe(false);
  });
});

describe('#parseSteps', () => {
  it('should parse a simple sentence', () => {
    const result = parseSteps('P Ts K', ['P', 'Ts', 'K']);
    expect(result).toHaveLength(3);
    expect(result[0].symbol).toBe('P');
    expect(result[1].symbol).toBe('Ts');
    expect(result[2].symbol).toBe('K');
  });

  it('should parse a sentence with a group', () => {
    const result = parseSteps('P (Ts P) K', ['P', 'Ts', 'K']);
    expect(result).toHaveLength(3);
    expect(result[1].isGroup).toBe(true);
    expect(result[1].steps).toHaveLength(2);
  });

  it('should mark invalid symbols', () => {
    const result = parseSteps('P X K', ['P', 'Ts', 'K']);
    expect(result[1].valid).toBe(false);
  });

  it('should return empty array for empty sentence', () => {
    const result = parseSteps('', ['P', 'Ts', 'K']);
    expect(result).toHaveLength(0);
  });

  it('should mark group as invalid if it contains an invalid symbol', () => {
    const result = parseSteps('(P X)', ['P', 'Ts', 'K']);
    expect(result[0].isGroup).toBe(true);
    expect(result[0].valid).toBe(false);
  });
});

describe('#countSentenceSteps', () => {
  it('should count simple steps', () => {
    expect(countSentenceSteps('P Ts K .')).toBe(4);
  });

  it('should count a group as one step', () => {
    expect(countSentenceSteps('P (Ts K) .')).toBe(3);
  });

  it('should return 0 for empty sentence', () => {
    expect(countSentenceSteps('')).toBe(0);
  });

  it('should count multiple groups correctly', () => {
    expect(countSentenceSteps('P (Ts K) (. P) .')).toBe(4);
  });
});

describe('#normalizeSentences', () => {
  it('should return empty array unchanged', () => {
    expect(normalizeSentences([])).toEqual([]);
  });

  it('should not modify the first sentence', () => {
    const result = normalizeSentences(['P Ts K .', 'P']);
    expect(result[0]).toBe('P Ts K .');
  });

  it('should pad a shorter sentence with silences', () => {
    const result = normalizeSentences(['P Ts K .', 'P K Ts']);
    expect(result[1]).toBe('P K Ts .');
  });

  it('should pad a shorter sentence with silences and preserve trailing space', () => {
    const result = normalizeSentences(['P Ts K .', 'P K Ts ']);
    expect(result[1]).toBe('P K Ts . ');
  });

  it('should truncate a longer sentence', () => {
    const result = normalizeSentences(['P Ts K .', 'P K Ts Pf Ts']);
    expect(result[1]).toBe('P K Ts Pf');
  });

  it('should truncate a longer sentence and preserve trailing space', () => {
    const result = normalizeSentences(['P Ts K .', 'P K Ts Pf Ts ']);
    expect(result[1]).toBe('P K Ts Pf ');
  });

  it('should count a group as one step when truncating', () => {
    const result = normalizeSentences(['P Ts K .', 'P (K . . .) P (Ts .) Ts']);
    expect(result[1]).toBe('P (K . . .) P (Ts .)');
  });

  it('should count a group as one step when padding', () => {
    const result = normalizeSentences(['P Ts Pf K', 'P (K . . .) P']);
    expect(result[1]).toBe('P (K . . .) P .');
  });
});

describe('#parseMultiTrackSteps', () => {
  it('should return columns aligned across tracks', () => {
    const result = parseMultiTrackSteps(['P Ts', 'K .'], ['P', 'Ts', 'K', '.']);
    expect(result).toHaveLength(2);
    expect(result[0].steps[0].step?.symbol).toBe('P');
    expect(result[0].steps[1].step?.symbol).toBe('K');
    expect(result[1].steps[0].step?.symbol).toBe('Ts');
    expect(result[1].steps[1].step?.symbol).toBe('.');
  });

  it('should fill with null when a track is shorter', () => {
    const result = parseMultiTrackSteps(['P Ts K', 'P'], ['P', 'Ts', 'K']);
    expect(result).toHaveLength(3);
    expect(result[1].steps[1].step).toBeNull();
    expect(result[2].steps[1].step).toBeNull();
  });

  it('should return empty array for empty sentences', () => {
    const result = parseMultiTrackSteps([], ['P', 'Ts', 'K']);
    expect(result).toHaveLength(0);
  });

  it('should handle groups as single columns', () => {
    const result = parseMultiTrackSteps(
      ['P (Ts K)', 'K .'],
      ['P', 'Ts', 'K', '.'],
    );
    expect(result).toHaveLength(2);
    expect(result[1].steps[0].step?.isGroup).toBe(true);
  });

  it('should carry correct sentenceIndex', () => {
    const result = parseMultiTrackSteps(['P Ts', 'K .'], ['P', 'Ts', 'K', '.']);
    expect(result[0].steps[0].sentenceIndex).toBe(0);
    expect(result[0].steps[1].sentenceIndex).toBe(1);
  });

  it('should carry correct tokenIndex for simple tokens', () => {
    const result = parseMultiTrackSteps(['P Ts K'], ['P', 'Ts', 'K']);
    expect(result[0].steps[0].tokenIndex).toBe(0);
    expect(result[1].steps[0].tokenIndex).toBe(1);
    expect(result[2].steps[0].tokenIndex).toBe(2);
  });

  it('should carry correct tokenIndex for groups', () => {
    const result = parseMultiTrackSteps(['P (Ts K) .'], ['P', 'Ts', 'K', '.']);
    expect(result[0].steps[0].tokenIndex).toBe(0); // P
    expect(result[1].steps[0].tokenIndex).toBe(1); // (Ts K) -> Ts à l'index 1, K à 2
    expect(result[2].steps[0].tokenIndex).toBe(3); // .
  });
});

describe('#flatTokenCount', () => {
  it('should count simple tokens', () => {
    expect(flatTokenCount('P Ts K .')).toBe(4);
  });

  it('should count tokens inside groups', () => {
    expect(flatTokenCount('P (Ts K) .')).toBe(4);
  });

  it('should count multiple groups correctly', () => {
    expect(flatTokenCount('P (Ts K) (. P) .')).toBe(6);
  });

  it('should return 0 for empty sentence', () => {
    expect(flatTokenCount('')).toBe(0);
  });

  it('should count nested tokens in multiple groups', () => {
    expect(flatTokenCount('(P Ts) (K .)')).toBe(4);
  });
});
