import { InstrumentController } from '../controller/instrument-controller';
import { Instrument } from '../models/instrument-model';
import * as instrumentService from '../../instruments/services/instrument-service';
const instrumentOne: Instrument = {
  id: 'Kickdrum',
  symbol: 'P',
  filename: 'kickdrum.mp3',
  name: 'kickdrum',
};
const instrumentTwo: Instrument = {
  id: 'Hi Hat',
  symbol: 'Ts',
  filename: 'hihat.mp3',
  name: 'hihat',
};
const instrumentThree: Instrument = {
  id: 'Silence',
  symbol: '.',
  filename: null,
  name: null,
};
const instruments: Instrument[] = [
  instrumentOne,
  instrumentTwo,
  instrumentThree,
];
let instrumentController: InstrumentController;

describe('#getInstrumentNameFromSymbol', () => {
  beforeAll(async () => {
    jest
      .spyOn(instrumentService, 'getAllInstruments')
      .mockResolvedValue(instruments);
    instrumentController = await InstrumentController.getInstance();
  });
  it('should throw an error because the symbol does not match any instrument', async () => {
    // Given
    const symbol: string = 'K';
    // When - Then
    expect(() =>
      instrumentController.getInstrumentNameFromSymbol(symbol),
    ).toThrow(`Le symbole K n'existe pas.`);
  });
});

describe('#getInstrumentFileNameFromSymbol', () => {
  beforeAll(async () => {
    jest
      .spyOn(instrumentService, 'getAllInstruments')
      .mockResolvedValue(instruments);
    instrumentController = await InstrumentController.getInstance();
  });
  it('should throw an error because the symbol does not match any instrument', async () => {
    // Given
    const symbol: string = 'K';
    // When - Then
    expect(() =>
      instrumentController.getInstrumentFileNameFromSymbol(symbol),
    ).toThrow(`Le symbole K n'existe pas.`);
  });
});
