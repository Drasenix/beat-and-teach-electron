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
  referenceFrequency: null,
};
const instrumentDTOTwo: InstrumentDTO = {
  id: 2,
  slug: 'Hi Hat',
  symbol: 'Ts',
  filepath: './assets/audio/hihat.mp3',
  name: 'hihat',
  referenceFrequency: null,
};
const instrumentDTOThree: InstrumentDTO = {
  id: 3,
  slug: 'Silence',
  symbol: '.',
  filepath: null,
  name: null,
  referenceFrequency: null,
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
    referenceFrequency: null,
  },
  {
    id: 2,
    slug: 'hihat',
    symbol: 'Ts',
    name: 'hihat',
    filepath: '/path/hihat.mp3',
    referenceFrequency: null,
  },
  {
    id: 3,
    slug: 'silence',
    symbol: '.',
    name: null,
    filepath: null,
    referenceFrequency: null,
  },
  {
    id: 4,
    slug: 'hum',
    symbol: 'Hum',
    name: 'hum',
    filepath: '/path/hum.mp3',
    referenceFrequency: 220,
  },
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
    expect(result).toEqual(['P', 'Ts', '.', 'Hum']);
  });

  it('should reflect changes after reloading instruments', () => {
    instrumentEngine.loadInstruments([
      {
        id: 1,
        slug: 'kickdrum',
        symbol: 'P',
        name: 'kickdrum',
        filepath: '/path/kickdrum.mp3',
        referenceFrequency: null,
      },
      {
        id: 2,
        slug: 'hihat',
        symbol: 'Ts',
        name: 'hihat',
        filepath: '/path/hihat.mp3',
        referenceFrequency: null,
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

describe('#getInstrumentReferenceFrequency', () => {
  it('should return reference frequency for a known instrument', () => {
    instrumentEngine.loadInstruments(sampleInstruments);
    const result = instrumentEngine.getInstrumentReferenceFrequency('Hum');
    expect(result).toBe(220);
  });

  it('should return null when instrument has no reference frequency', () => {
    instrumentEngine.loadInstruments(sampleInstruments);
    const result = instrumentEngine.getInstrumentReferenceFrequency('P');
    expect(result).toBeNull();
  });

  it('should throw an error for unknown symbol', () => {
    instrumentEngine.loadInstruments(sampleInstruments);
    expect(() => instrumentEngine.getInstrumentReferenceFrequency('X')).toThrow(
      `Le symbole X n'existe pas.`,
    );
  });
});
