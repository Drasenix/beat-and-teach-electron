import InstrumentEngine from '../engine/instrument-engine';
import { InstrumentDTO } from '../../../../shared/models/instrument-dto';
import * as instrumentService from '../services/instrument-service';

const instrumentDTOOne: InstrumentDTO = {
  id: 1,
  slug: 'Kickdrum',
  symbol: 'P',
  filepath: './assets/audio/kickdrum.mp3',
  name: 'kickdrum',
};
const instrumentDTOTwo: InstrumentDTO = {
  id: 2,
  slug: 'Hi Hat',
  symbol: 'Ts',
  filepath: './assets/audio/hihat.mp3',
  name: 'hihat',
};
const instrumentDTOThree: InstrumentDTO = {
  id: 3,
  slug: 'Silence',
  symbol: '.',
  filepath: null,
  name: null,
};
const instrumentsDTO: InstrumentDTO[] = [
  instrumentDTOOne,
  instrumentDTOTwo,
  instrumentDTOThree,
];

let instrumentEngine: InstrumentEngine;

describe('#getInstrumentNameFromSymbol', () => {
  beforeAll(async () => {
    jest
      .spyOn(instrumentService, 'getAllInstruments')
      .mockResolvedValue(instrumentsDTO);
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

describe('#getInstrumentFilePathsFromSymbol', () => {
  beforeAll(async () => {
    jest
      .spyOn(instrumentService, 'getAllInstruments')
      .mockResolvedValue(instrumentsDTO);
    instrumentEngine = await InstrumentEngine.getInstance();
  });
  it('should throw an error because the symbol does not match any instrument', async () => {
    // Given
    const symbol: string = 'K';
    // When - Then
    expect(() =>
      instrumentEngine.getInstrumentFilePathsFromSymbol(symbol),
    ).toThrow(`Le symbole K n'existe pas.`);
  });
});
