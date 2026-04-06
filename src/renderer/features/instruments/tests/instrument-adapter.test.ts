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
    };
    const instrument2: InstrumentDTO = {
      id: 2,
      slug: 'Hi Hat',
      symbol: 'Ts',
      filepath: './assets/audio/hihat.mp3',
      name: 'hihat',
    };
    const tested: InstrumentDTO[] = [instrument1, instrument2];
    // When
    const result: Instrument[] = adaptInstruments(tested);
    // Then
    const instrument1Expected: InstrumentDTO = {
      id: 1,
      slug: 'Kick Drum',
      symbol: 'P',
      filepath: './assets/audio/kickdrum.mp3',
      name: 'kickdrum',
    };
    const instrument2Expected: InstrumentDTO = {
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
