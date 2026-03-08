import { InstrumentDB } from '../../../../shared/models/instrument-db';
import adaptInstruments from '../adapters/instrument-adapter';
import { Instrument } from '../models/instrument-model';

describe('adaptInstruments', () => {
  it('should adapt instruments correctly', () => {
    // Given
    const instrument1: InstrumentDB = {
      id: 1,
      slug: 'Kick Drum',
      symbol: 'P',
      filepath: './assets/audio/kickdrum.mp3',
      name: 'kickdrum',
    };
    const instrument2: InstrumentDB = {
      id: 2,
      slug: 'Hi Hat',
      symbol: 'Ts',
      filepath: './assets/audio/hihat.mp3',
      name: 'hihat',
    };
    const tested: InstrumentDB[] = [instrument1, instrument2];
    // When
    const result: Instrument[] = adaptInstruments(tested);
    // Then
    const instrument1Expected: InstrumentDB = {
      id: 1,
      slug: 'Kick Drum',
      symbol: 'P',
      filepath: './assets/audio/kickdrum.mp3',
      name: 'kickdrum',
    };
    const instrument2Expected: InstrumentDB = {
      id: 2,
      slug: 'Hi Hat',
      symbol: 'Ts',
      filepath: './assets/audio/hihat.mp3',
      name: 'hihat',
    };
    const expected: Instrument[] = [instrument1Expected, instrument2Expected];
    expect(result).toEqual(expected);
  });
});
