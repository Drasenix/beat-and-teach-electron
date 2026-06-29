import {
  createStep,
  createGroup,
  parseSteps,
  countSentenceSteps,
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

  it('should extract frequency from @freq notation', () => {
    const result = createStep('Hum@440', ['Hum', 'P', 'Ts'], 0);
    expect(result).toEqual({
      id: 'step-0',
      symbol: 'Hum',
      valid: true,
      isGroup: false,
      frequency: 440,
    });
  });

  it('should mark step invalid when symbol with @ is unknown', () => {
    const result = createStep('X@440', ['P', 'Ts', 'K'], 0);
    expect(result).toEqual({
      id: 'step-0',
      symbol: 'X',
      valid: false,
      isGroup: false,
      frequency: 440,
    });
  });

  it('should ignore invalid frequency and keep raw symbol', () => {
    const result = createStep('Hum@abc', ['Hum', 'P', 'Ts'], 0);
    expect(result).toEqual({
      id: 'step-0',
      symbol: 'Hum',
      valid: true,
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

  it('should extract frequencies from @freq notation in group', () => {
    const result = createGroup('Ts@440 Hum@880', ['Ts', 'Hum', 'K'], 0);
    expect(result.isGroup).toBe(true);
    expect(result.valid).toBe(true);
    expect(result.steps).toHaveLength(2);
    expect(result.steps?.[0].frequency).toBe(440);
    expect(result.steps?.[1].frequency).toBe(880);
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

  it('should extract frequency from @freq in atomic tokens', () => {
    const result = parseSteps('Hum@440 P@220', ['Hum', 'P', 'Ts']);
    expect(result[0].frequency).toBe(440);
    expect(result[1].frequency).toBe(220);
  });

  it('should extract frequency from @freq inside groups', () => {
    const result = parseSteps('P (Hum@440 Ts@880)', ['P', 'Hum', 'Ts']);
    expect(result[1].isGroup).toBe(true);
    expect(result[1].steps?.[0].frequency).toBe(440);
    expect(result[1].steps?.[1].frequency).toBe(880);
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
