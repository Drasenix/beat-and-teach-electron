import InstrumentEngine from '../engine/instrument-engine';
import { Instrument } from '../models/instrument-model';
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

const sampleInstruments: Instrument[] = [
  {
    id: 1,
    slug: 'kickdrum',
    symbol: 'P',
    name: 'kickdrum',
    filepath: '/path/kickdrum.mp3',
  },
  {
    id: 2,
    slug: 'hihat',
    symbol: 'Ts',
    name: 'hihat',
    filepath: '/path/hihat.mp3',
  },
  { id: 3, slug: 'silence', symbol: '.', name: null, filepath: null },
];

describe('#getAllSymbols', () => {
  beforeAll(() => {
    instrumentEngine = InstrumentEngine.getInstance();
  });

  it('should return an empty array when no instruments are loaded', () => {
    const result = instrumentEngine.getAllSymbols();
    expect(result).toEqual([]);
  });

  it('should return all symbols from loaded instruments', () => {
    instrumentEngine.loadInstruments(sampleInstruments);
    const result = instrumentEngine.getAllSymbols();
    expect(result).toEqual(['P', 'Ts', '.']);
  });

  it('should reflect changes after reloading instruments', () => {
    instrumentEngine.loadInstruments([
      {
        id: 1,
        slug: 'kickdrum',
        symbol: 'P',
        name: 'kickdrum',
        filepath: '/path/kickdrum.mp3',
      },
      {
        id: 2,
        slug: 'hihat',
        symbol: 'Ts',
        name: 'hihat',
        filepath: '/path/hihat.mp3',
      },
    ]);
    const result = instrumentEngine.getAllSymbols();
    expect(result).toHaveLength(2);
  });
});

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
