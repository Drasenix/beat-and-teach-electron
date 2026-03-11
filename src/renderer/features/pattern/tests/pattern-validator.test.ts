import { validatePattern } from '../utils/pattern-validator';

describe('#validatePattern', () => {
  it('retourne une erreur si le nom est vide', () => {
    const result = validatePattern({ name: '', sentence: 'P . K .' });
    expect(result).toContain('Le nom est requis.');
  });

  it('retourne une erreur si la phrase est vide', () => {
    const result = validatePattern({ name: 'Mon pattern', sentence: '' });
    expect(result).toContain('La phrase est requise.');
  });

  it('retourne plusieurs erreurs si plusieurs champs sont invalides', () => {
    const result = validatePattern({ name: '', sentence: '' });
    expect(result).toHaveLength(2);
  });

  it('retourne un tableau vide si tous les champs sont valides', () => {
    const result = validatePattern({
      name: 'Mon pattern',
      sentence: 'P . K .',
    });
    expect(result).toHaveLength(0);
  });

  it('retourne une erreur si le nom ne contient que des espaces', () => {
    const result = validatePattern({ name: '   ', sentence: 'P . K .' });
    expect(result).toContain('Le nom est requis.');
  });

  it('retourne une erreur si la phrase ne contient que des espaces', () => {
    const result = validatePattern({ name: 'Mon pattern', sentence: '   ' });
    expect(result).toContain('La phrase est requise.');
  });
});
