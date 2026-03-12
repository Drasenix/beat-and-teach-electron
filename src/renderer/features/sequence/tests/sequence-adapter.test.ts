import toSequenceNote from '../adapters/sequence-adapter';

describe('#toSequenceNote', () => {
  it('retourne la valeur string telle quelle', () => {
    expect(toSequenceNote('Kick')).toBe('Kick');
  });

  it('retourne null si la valeur est null', () => {
    expect(toSequenceNote(null)).toBeNull();
  });
});
