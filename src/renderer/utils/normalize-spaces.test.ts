import normalizeSpaces from './normalize-spaces';

describe('#normalizeSpaces', () => {
  it('should collapse multiple spaces into one', () => {
    const input: string = 'P  Ts   K';
    const result: string = normalizeSpaces(input);
    expect(result).toEqual('P Ts K');
  });

  it('should remove space after opening parenthesis', () => {
    const input: string = '( p';
    const result: string = normalizeSpaces(input);
    expect(result).toEqual('(p');
  });

  it('should remove space after opening parenthesis inside text', () => {
    const input: string = 'P ( Ts K)';
    const result: string = normalizeSpaces(input);
    expect(result).toEqual('P (Ts K)');
  });

  it('should remove space before closing parenthesis', () => {
    const input: string = 'Ts )';
    const result: string = normalizeSpaces(input);
    expect(result).toEqual('Ts)');
  });

  it('should remove space before closing parenthesis inside text', () => {
    const input: string = 'P (Ts K )';
    const result: string = normalizeSpaces(input);
    expect(result).toEqual('P (Ts K)');
  });

  it('should handle combined case ( . )', () => {
    const input: string = '( . )';
    const result: string = normalizeSpaces(input);
    expect(result).toEqual('(.)');
  });

  it('should not modify a well-formed group', () => {
    const input: string = '(Ts K)';
    const result: string = normalizeSpaces(input);
    expect(result).toEqual('(Ts K)');
  });

  it('should handle multiple spaces with parentheses', () => {
    const input: string = '( Ts   K  )';
    const result: string = normalizeSpaces(input);
    expect(result).toEqual('(Ts K)');
  });

  it('should return empty string unchanged', () => {
    const input: string = '';
    const result: string = normalizeSpaces(input);
    expect(result).toEqual('');
  });
});
