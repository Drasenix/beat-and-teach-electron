import { createStep, createGroup, parseSteps } from '../utils/pattern-parser';

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
