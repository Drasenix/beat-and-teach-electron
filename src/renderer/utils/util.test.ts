import {
  removeDuplicates,
  removeParenthesis,
  toSnakeCase,
  extractIpcError,
} from './util';

describe('#removeDuplicates', () => {
  it('should remove duplicates entry in the array', () => {
    // Given
    const tested: string[] = ['P', 'T', 'K', 'T'];
    // When
    const result: string[] = removeDuplicates(tested);
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
    const result: string = removeParenthesis(tested);
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
    const result: string = toSnakeCase(tested);
    // Then
    expect(result).toEqual('hi-hat');
  });

  it('should handle multiple spaces', () => {
    // Given
    const tested: string = 'boom  bap';
    // When
    const result: string = toSnakeCase(tested);
    // Then
    expect(result).toEqual('boom-bap');
  });
});

describe('#extractIpcError', () => {
  it('should extract the message from an IPC error', () => {
    // Given
    const error = {
      message:
        "Error invoking remote method 'create-pattern': Error: La phrase est requise.",
    };
    // When
    const result = extractIpcError(error);
    // Then
    expect(result).toBe('La phrase est requise.');
  });

  it('should return the fallback when error is undefined', () => {
    // Given
    const error = undefined;
    // When
    const result = extractIpcError(error);
    // Then
    expect(result).toBe('Une erreur est survenue.');
  });

  it('should return the fallback when message is empty', () => {
    // Given
    const error = { message: '' };
    // When
    const result = extractIpcError(error);
    // Then
    expect(result).toBe('Une erreur est survenue.');
  });

  it('should return the message as-is when it does not match the IPC prefix', () => {
    // Given
    const error = { message: 'Une erreur inattendue.' };
    // When
    const result = extractIpcError(error);
    // Then
    expect(result).toBe('Une erreur inattendue.');
  });

  it('should use a custom fallback when provided', () => {
    // Given
    const error = undefined;
    // When
    const result = extractIpcError(error, 'Erreur personnalisée.');
    // Then
    expect(result).toBe('Erreur personnalisée.');
  });
});
