import * as sequenceService from '../service/sequence-service';
import * as instrumentFacade from '../../instruments/facade/instrument-facade';
import { SequenceNotes } from '../types/sequence-note';
import {
  InstrumentFilePath,
  InstrumentName,
} from '../../../../shared/types/instrument';

const instrumentFilePaths: Record<string, InstrumentFilePath[]> = {
  P: [{ name: 'kickdrum', filepath: './assets/audio/kickdrum.mp3' }],
  Ts: [{ name: 'hihat', filepath: './assets/audio/hihat.mp3' }],
  '.': [{ name: null, filepath: null }],
};

const assertSymbolKnown = (symbol: string) => {
  if (!(symbol in instrumentFilePaths)) {
    throw new Error(`Le symbole ${symbol} n'existe pas.`);
  }
};

describe('#prepareFilePaths', () => {
  beforeAll(() => {
    jest
      .spyOn(instrumentFacade, 'getInstrumentFilePathsFromSymbol')
      .mockImplementation(async (symbol: string) => {
        assertSymbolKnown(symbol);
        return instrumentFilePaths[symbol];
      });
  });

  it('should return a list of filepaths based on a sentence and a list of instruments', async () => {
    // Given
    const sentenceOK: string = 'P (Ts P) Ts .';
    // When
    const result: InstrumentFilePath[] =
      await sequenceService.prepareFilePaths(sentenceOK);
    // Then
    const expected: InstrumentFilePath[] = [
      { name: 'kickdrum', filepath: './assets/audio/kickdrum.mp3' },
      { name: 'hihat', filepath: './assets/audio/hihat.mp3' },
      { name: null, filepath: null },
    ];
    expect(result).toEqual(expected);
  });

  it('should throw an error because one of the symbols does not match any instrument', async () => {
    // Given
    const sentenceKO: string = 'P (Ts K) Ts .';
    // When - Then
    await expect(sequenceService.prepareFilePaths(sentenceKO)).rejects.toThrow(
      `Le symbole K n'existe pas.`,
    );
  });
});

describe('#preparePattern', () => {
  beforeAll(() => {
    const instrumentNames: Record<string, InstrumentName> = {
      P: 'kickdrum',
      Ts: 'hihat',
      '.': null,
    };
    jest
      .spyOn(instrumentFacade, 'getInstrumentNameFromSymbol')
      .mockImplementation(async (symbol: string) => {
        assertSymbolKnown(symbol);
        return instrumentNames[symbol];
      });
  });

  it('should return a list of notes based on a sentence and a list of instruments', async () => {
    // Given
    const sentenceOK: string = 'P (Ts P) Ts .';
    // When
    const result: SequenceNotes[] =
      await sequenceService.preparePattern(sentenceOK);
    // Then
    const expected: SequenceNotes[] = [
      'kickdrum',
      ['hihat', 'kickdrum'],
      'hihat',
      null,
    ];
    expect(result).toEqual(expected);
  });

  it('should throw an error because one of the symbols does not match any instrument', async () => {
    // Given
    const sentenceKO: string = 'P (Ts K) Ts .';
    // When - Then
    await expect(sequenceService.preparePattern(sentenceKO)).rejects.toThrow(
      `Le symbole K n'existe pas.`,
    );
  });
});
