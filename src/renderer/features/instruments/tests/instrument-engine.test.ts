import { InstrumentEngine } from '../engine/instrument-engine';
import { InstrumentDB } from '../../../../main/db/models/instrument-db';
import * as instrumentService from '../services/instrument-service';

const instrumentDBOne: InstrumentDB = {
  id: 'Kickdrum',
  symbol: 'P',
  filename: 'kickdrum.mp3',
  name: 'kickdrum',
};
const instrumentDBTwo: InstrumentDB = {
  id: 'Hi Hat',
  symbol: 'Ts',
  filename: 'hihat.mp3',
  name: 'hihat',
};
const instrumentDBThree: InstrumentDB = {
  id: 'Silence',
  symbol: '.',
  filename: null,
  name: null,
};
const instrumentsDB: InstrumentDB[] = [
  instrumentDBOne,
  instrumentDBTwo,
  instrumentDBThree,
];

let instrumentEngine: InstrumentEngine;

describe('#getInstrumentNameFromSymbol', () => {
  beforeAll(async () => {
    jest
      .spyOn(instrumentService, 'getAllInstruments')
      .mockResolvedValue(instrumentsDB);
    instrumentEngine = await InstrumentEngine.getInstance();
  });
  it('should throw an error because the symbol does not match any instrument', async () => {
    // Given
    const symbol: string = 'K';
    // When - Then
    expect(() => instrumentEngine.getInstrumentNameFromSymbol(symbol)).toThrow(
      `Le symbole K n'existe pas.`,
    );
  });
});

describe('#getInstrumentFileNameFromSymbol', () => {
  beforeAll(async () => {
    jest
      .spyOn(instrumentService, 'getAllInstruments')
      .mockResolvedValue(instrumentsDB);
    instrumentEngine = await InstrumentEngine.getInstance();
  });
  it('should throw an error because the symbol does not match any instrument', async () => {
    // Given
    const symbol: string = 'K';
    // When - Then
    expect(() =>
      instrumentEngine.getInstrumentFileNameFromSymbol(symbol),
    ).toThrow(`Le symbole K n'existe pas.`);
  });
});
