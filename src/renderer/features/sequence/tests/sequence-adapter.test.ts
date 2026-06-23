import toSequenceNote from '../adapters/sequence-adapter';

describe('#toSequenceNote', () => {
  it('retourne un SequenceNote avec playbackRate par défaut à 1', () => {
    expect(toSequenceNote('Kick')).toEqual({ name: 'Kick', playbackRate: 1 });
  });

  it('retourne null si le nom est null', () => {
    expect(toSequenceNote(null)).toBeNull();
  });

  it('retourne un SequenceNote avec le playbackRate spécifié', () => {
    expect(toSequenceNote('Kick', 2.5)).toEqual({
      name: 'Kick',
      playbackRate: 2.5,
    });
  });

  it('retourne un SequenceNote avec le semitoneOffset spécifié', () => {
    expect(toSequenceNote('Kick', 2, 12)).toEqual({
      name: 'Kick',
      playbackRate: 2,
      semitoneOffset: 12,
    });
  });

  it("n'inclut pas semitoneOffset si non spécifié", () => {
    expect(toSequenceNote('Kick')).toEqual({ name: 'Kick', playbackRate: 1 });
  });
});
