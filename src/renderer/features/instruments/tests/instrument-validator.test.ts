import { validateInstrument } from '../utils/instrument-validator';

describe('#validateInstrument', () => {
  it('retourne une erreur si le symbole est vide', () => {
    const result = validateInstrument({
      symbol: '',
      name: 'Kick',
      filepath: '/audio/kick.wav',
    });
    expect(result).toContain('Le symbole est requis.');
  });

  it('retourne une erreur si le nom est vide', () => {
    const result = validateInstrument({
      symbol: 'K',
      name: '',
      filepath: '/audio/kick.wav',
    });
    expect(result).toContain('Le nom est requis.');
  });

  it('retourne une erreur si le filepath est null', () => {
    const result = validateInstrument({
      symbol: 'K',
      name: 'Kick',
      filepath: null,
    });
    expect(result).toContain('Le fichier audio est requis.');
  });

  it('retourne plusieurs erreurs si plusieurs champs sont invalides', () => {
    const result = validateInstrument({ symbol: '', name: '', filepath: null });
    expect(result).toHaveLength(3);
  });

  it('retourne un tableau vide si tous les champs sont valides', () => {
    const result = validateInstrument({
      symbol: 'K',
      name: 'Kick',
      filepath: '/audio/kick.wav',
    });
    expect(result).toHaveLength(0);
  });

  it('retourne une erreur si le symbole ne contient que des espaces', () => {
    const result = validateInstrument({
      symbol: '   ',
      name: 'Kick',
      filepath: '/audio/kick.wav',
    });
    expect(result).toContain('Le symbole est requis.');
  });

  it('retourne une erreur si le nom ne contient que des espaces', () => {
    const result = validateInstrument({
      symbol: 'K',
      name: '   ',
      filepath: '/audio/kick.wav',
    });
    expect(result).toContain('Le nom est requis.');
  });
});
