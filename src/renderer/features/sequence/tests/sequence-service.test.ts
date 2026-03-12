import * as sequenceFacade from '../service/sequence-service';
import * as instrumentService from '../../instruments/services/instrument-service';
import { SequenceNotes } from '../types/sequence-note';
import { InstrumentDB } from '../../../../shared/models/instrument-db';
import InstrumentEngine from '../../instruments/engine/instrument-engine';
import { InstrumentFilePath } from '../../../../shared/types/instrument';

const instrumentDBOne: InstrumentDB = {
  id: 1,
  slug: 'Kickdrum',
  symbol: 'P',
  filepath: './assets/audio/kickdrum.mp3',
  name: 'kickdrum',
};
const instrumentDBTwo: InstrumentDB = {
  id: 2,
  slug: 'Hi Hat',
  symbol: 'Ts',
  filepath: './assets/audio/hihat.mp3',
  name: 'hihat',
};
const instrumentDBThree: InstrumentDB = {
  id: 3,
  slug: 'Silence',
  symbol: '.',
  filepath: null,
  name: null,
};
const instrumentsDB: InstrumentDB[] = [
  instrumentDBOne,
  instrumentDBTwo,
  instrumentDBThree,
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let instrumentEngine: InstrumentEngine;
describe('#prepareFilePaths', () => {
  beforeAll(async () => {
    jest
      .spyOn(instrumentService, 'getAllInstruments')
      .mockResolvedValue(instrumentsDB);
    instrumentEngine = await InstrumentEngine.getInstance();
  });

  it('should return a list of filepaths based on a sentence and a list of instruments', async () => {
    // Given
    const sentenceOK: string = 'P (Ts P) Ts .';
    // When
    const result: InstrumentFilePath[] =
      await sequenceFacade.prepareFilePaths(sentenceOK);
    // Then
    const expectedResult: InstrumentFilePath[] = [
      { name: 'kickdrum', filepath: './assets/audio/kickdrum.mp3' },
      { name: 'hihat', filepath: './assets/audio/hihat.mp3' },
      { name: null, filepath: null },
    ];
    expect(result).toEqual(expectedResult);
  });

  it('should throw an error because one of the symbols in the sentence does not match any instrument', async () => {
    // Given
    const sentenceKO: string = 'P (Ts K) Ts .';
    // When - Then
    await expect(sequenceFacade.prepareFilePaths(sentenceKO)).rejects.toThrow(
      `Le symbole K n'existe pas.`,
    );
  });
});

describe('#preparePattern', () => {
  beforeAll(async () => {
    jest
      .spyOn(instrumentService, 'getAllInstruments')
      .mockResolvedValue(instrumentsDB);
    instrumentEngine = await InstrumentEngine.getInstance();
  });

  it('should return a list of symbols based on a sentence and a list of instruments', async () => {
    // Given
    const sentenceOK: string = 'P (Ts P) Ts .';
    // When
    const result: SequenceNotes[] =
      await sequenceFacade.preparePattern(sentenceOK);
    // Then
    const expected: SequenceNotes[] = [
      'kickdrum',
      ['hihat', 'kickdrum'],
      'hihat',
      null,
    ];
    expect(result).toEqual(expected);
  });

  it('should throw an error because on of the symbols in the sentence does not match any instrument', async () => {
    // Given
    const sentenceKO: string = 'P (Ts K) Ts .';
    // When - Then
    await expect(sequenceFacade.preparePattern(sentenceKO)).rejects.toThrow(
      `Le symbole K n'existe pas.`,
    );
  });
});
