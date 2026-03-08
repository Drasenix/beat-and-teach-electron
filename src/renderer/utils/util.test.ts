import * as util from './util';
describe('#removeDuplicates', () => {
  it('should remove duplicates entry in the array', () => {
    // Given
    const tested: string[] = ['P', 'T', 'K', 'T'];
    // When
    const result: string[] = util.removeDuplicates(tested);
    // Then
    const expected: string[] = ['P', 'T', 'K'];
    expect(result).toEqual(expected);
  });
});

describe('#removeParenthesis', () => {
  it('should remove all parenthesis in the string', () => {
    // Given
    const tested: string = '(P) T (K)';
    // When
    const result: string = util.removeParenthesis(tested);
    // Then
    const expected: string = 'P T K';
    expect(result).toEqual(expected);
  });
});

describe('#toSnakeCase', () => {
  it('should convert a name to a snake case equivalent', () => {
    // Given
    const tested: string = 'Hi Hat';
    // When
    const result: string = util.toSnakeCase(tested);
    // Then
    expect(result).toEqual('hi-hat');
  });

  it('should handle multiple spaces', () => {
    // Given
    const tested: string = 'boom  bap';
    // When
    const result: string = util.toSnakeCase(tested);
    // Then
    expect(result).toEqual('boom-bap');
  });
});
