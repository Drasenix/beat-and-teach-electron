import validatePattern, {
  areAllSymbolsValid,
} from '../utils/pattern-validator';

describe('#validatePattern', () => {
  it('retourne une erreur si le nom est vide', () => {
    const result = validatePattern({
      name: '',
      sentences: ['P . K .'],
    });
    expect(result).toContain('Le nom est requis.');
  });

  it('retourne une erreur si toutes les phrases sont vides', () => {
    const result = validatePattern({
      name: 'Mon pattern',
      sentences: [''],
    });
    expect(result).toContain('La phrase 1 est requise.');
  });

  it('retourne une erreur si le tableau sentences est vide', () => {
    const result = validatePattern({
      name: 'Mon pattern',
      sentences: [],
    });
    expect(result).toContain('Au moins une phrase est requise.');
  });

  it('retourne plusieurs erreurs si plusieurs champs sont invalides', () => {
    const result = validatePattern({
      name: '',
      sentences: ['', ''],
    });
    expect(result).toHaveLength(3); // nom + phrase 1 + phrase 2
  });

  it('retourne un tableau vide si tous les champs sont valides', () => {
    const result = validatePattern({
      name: 'Mon pattern',
      sentences: ['P . K .'],
    });
    expect(result).toHaveLength(0);
  });

  it('retourne une erreur si le nom ne contient que des espaces', () => {
    const result = validatePattern({
      name: '   ',
      sentences: ['P . K .'],
    });
    expect(result).toContain('Le nom est requis.');
  });

  it('retourne une erreur si une phrase ne contient que des espaces', () => {
    const result = validatePattern({
      name: 'Mon pattern',
      sentences: ['   '],
    });
    expect(result).toContain('La phrase 1 est requise.');
  });
});

describe('#areAllSymbolsValid', () => {
  const VALID_SYMBOLS = ['P', 'Ts', 'K', 'Bw', 'Pf'];

  it('should return true when all symbols are valid', () => {
    const result = areAllSymbolsValid(['P (Ts K) .'], VALID_SYMBOLS);
    expect(result).toBe(true);
  });

  it('should return false when a symbol is unknown', () => {
    const result = areAllSymbolsValid(['P X Ts'], VALID_SYMBOLS);
    expect(result).toBe(false);
  });

  it('should return false when a symbol inside a group is unknown', () => {
    const result = areAllSymbolsValid(['P (Ts X) K'], VALID_SYMBOLS);
    expect(result).toBe(false);
  });

  it('should treat silence (.) as always valid', () => {
    const result = areAllSymbolsValid(['. . .'], []);
    expect(result).toBe(true);
  });

  it('should return true for an empty sentence', () => {
    const result = areAllSymbolsValid([''], VALID_SYMBOLS);
    expect(result).toBe(true);
  });

  it('should return true for empty sentences array', () => {
    const result = areAllSymbolsValid([], VALID_SYMBOLS);
    expect(result).toBe(true);
  });

  it('should return false if only the first sentence is invalid', () => {
    const result = areAllSymbolsValid(['X K .', 'P Ts K'], VALID_SYMBOLS);
    expect(result).toBe(false);
  });

  it('should return false if only the second sentence is invalid', () => {
    const result = areAllSymbolsValid(['P Ts K', 'P X K'], VALID_SYMBOLS);
    expect(result).toBe(false);
  });

  it('should handle sentences with multiple groups', () => {
    const result = areAllSymbolsValid(['(P Ts) (K Bw) Pf'], VALID_SYMBOLS);
    expect(result).toBe(true);
  });

  it('should handle whitespace-only sentence', () => {
    const result = areAllSymbolsValid(['   '], VALID_SYMBOLS);
    expect(result).toBe(true);
  });

  it('should strip @freq and validate the cleaned symbol', () => {
    const result = areAllSymbolsValid(['Hum@440 P@220'], ['Hum', 'P']);
    expect(result).toBe(true);
  });

  it('should return false when cleaned symbol is unknown', () => {
    const result = areAllSymbolsValid(['Hum@440 X@880'], ['Hum']);
    expect(result).toBe(false);
  });

  it('should strip @freq from symbols inside groups', () => {
    const result = areAllSymbolsValid(
      ['P (Hum@440 Ts@880)'],
      ['P', 'Hum', 'Ts'],
    );
    expect(result).toBe(true);
  });
});
