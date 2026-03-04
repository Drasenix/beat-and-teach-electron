import { InstrumentDB } from '../../../../main/db/models/instrument-db';
import adaptInstruments from '../models/instrument-adapter';
import { Instrument } from '../models/instrument-model';

describe('adaptInstruments', () => {
  it('should adapt instruments correctly', () => {
    // Given
    const instrument1: InstrumentDB = {
      id: 'Kick Drum',
      symbol: 'P',
      filename: 'kickdrum.mp3',
      name: 'kickdrum',
    };
    const instrument2: InstrumentDB = {
      id: 'Hi Hat',
      symbol: 'Ts',
      filename: 'hihat.mp3',
      name: 'hihat',
    };
    const tested: InstrumentDB[] = [instrument1, instrument2];
    // When
    const result: Instrument[] = adaptInstruments(tested);
    // Then
    const instrument1Expected: InstrumentDB = {
      id: 'Kick Drum',
      symbol: 'P',
      filename: 'kickdrum.mp3',
      name: 'kickdrum',
    };
    const instrument2Expected: InstrumentDB = {
      id: 'Hi Hat',
      symbol: 'Ts',
      filename: 'hihat.mp3',
      name: 'hihat',
    };
    const expected: Instrument[] = [instrument1Expected, instrument2Expected];
    expect(result).toEqual(expected);
  });
});
