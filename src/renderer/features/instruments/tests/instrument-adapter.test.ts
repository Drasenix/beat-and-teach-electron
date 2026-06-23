import { InstrumentDTO } from '../../../../shared/models/instrument-dto';
import adaptInstruments from '../adapters/instrument-adapter';
import { Instrument } from '../models/instrument-model';

describe('adaptInstruments', () => {
  it('should adapt instruments correctly', () => {
    // Given
    const instrument1: InstrumentDTO = {
      id: 1,
      slug: 'Kick Drum',
      symbol: 'P',
      filepath: './assets/audio/kickdrum.mp3',
      name: 'kickdrum',
      referenceFrequency: null,
    };
    const instrument2: InstrumentDTO = {
      id: 2,
      slug: 'Hi Hat',
      symbol: 'Ts',
      filepath: './assets/audio/hihat.mp3',
      name: 'hihat',
      referenceFrequency: 440,
    };
    const tested: InstrumentDTO[] = [instrument1, instrument2];
    // When
    const result: Instrument[] = adaptInstruments(tested);
    // Then
    const expected: Instrument[] = [
      {
        id: 1,
        slug: 'Kick Drum',
        symbol: 'P',
        filepath: './assets/audio/kickdrum.mp3',
        name: 'kickdrum',
        referenceFrequency: null,
      },
      {
        id: 2,
        slug: 'Hi Hat',
        symbol: 'Ts',
        filepath: './assets/audio/hihat.mp3',
        name: 'hihat',
        referenceFrequency: 440,
      },
    ];
    expect(result).toEqual(expected);
  });
});
