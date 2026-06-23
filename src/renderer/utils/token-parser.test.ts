import { parseToken } from './token-parser';

describe('#parseToken', () => {
  it('should return symbol without frequency when no @ is present', () => {
    const result = parseToken('Hum');
    expect(result).toEqual({ symbol: 'Hum' });
  });

  it('should extract symbol and frequency when @freq is present', () => {
    const result = parseToken('Hum@440');
    expect(result).toEqual({ symbol: 'Hum', frequency: 440 });
  });

  it('should handle float frequencies', () => {
    const result = parseToken('Hum@466.16');
    expect(result).toEqual({ symbol: 'Hum', frequency: 466.16 });
  });

  it('should handle silence with frequency', () => {
    const result = parseToken('.@220');
    expect(result).toEqual({ symbol: '.', frequency: 220 });
  });

  it('should return symbol only when frequency is empty', () => {
    const result = parseToken('Hum@');
    expect(result).toEqual({ symbol: 'Hum' });
  });

  it('should return symbol only when frequency is not a number', () => {
    const result = parseToken('Hum@abc');
    expect(result).toEqual({ symbol: 'Hum' });
  });

  it('should return symbol only when frequency is zero', () => {
    const result = parseToken('Hum@0');
    expect(result).toEqual({ symbol: 'Hum' });
  });

  it('should return symbol only when frequency is negative', () => {
    const result = parseToken('Hum@-440');
    expect(result).toEqual({ symbol: 'Hum' });
  });

  it('should handle token that starts with @', () => {
    const result = parseToken('@440');
    expect(result).toEqual({ symbol: '@440' });
  });

  it('should handle token with multiple @', () => {
    const result = parseToken('A@B@440');
    expect(result).toEqual({ symbol: 'A' });
  });

  it('should handle token with @ in the middle of symbol characters', () => {
    const result = parseToken('A<@440');
    expect(result).toEqual({ symbol: 'A<', frequency: 440 });
  });

  it('should extract frequency from @note notation like A#4', () => {
    const result = parseToken('Hum@A#4');
    expect(result).toEqual({ symbol: 'Hum', frequency: 466.1637615180899 });
  });

  it('should extract frequency from @C4', () => {
    const result = parseToken('Hum@C4');
    expect(result).toEqual({ symbol: 'Hum', frequency: 261.6255653005986 });
  });

  it('should extract frequency from @Bb3', () => {
    const result = parseToken('Hum@Bb3');
    expect(result).toEqual({ symbol: 'Hum', frequency: 233.08188075904496 });
  });

  it('should handle lowercase note names', () => {
    const result = parseToken('Hum@a4');
    expect(result).toEqual({ symbol: 'Hum', frequency: 440 });
  });

  it('should return symbol only for invalid note name', () => {
    const result = parseToken('Hum@H4');
    expect(result).toEqual({ symbol: 'Hum' });
  });
});
