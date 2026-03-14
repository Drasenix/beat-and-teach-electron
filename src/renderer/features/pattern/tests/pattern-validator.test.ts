import validatePattern from '../utils/pattern-validator';

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
