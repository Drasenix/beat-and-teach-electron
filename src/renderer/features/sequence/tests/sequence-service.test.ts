import * as sequenceService from '../services/sequence-service';
import * as instrumentService from '../../instruments/services/instrument-service';
import { SequenceNotes } from '../types/sequence-note';
import { InstrumentDB } from '../../../../main/db/models/instrument-db';
import { InstrumentEngine } from '../../instruments/engine/instrument-engine';

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

describe('#prepareFileNames', () => {
  beforeAll(async () => {
    jest
      .spyOn(instrumentService, 'getAllInstruments')
      .mockResolvedValue(instrumentsDB);
    instrumentEngine = await InstrumentEngine.getInstance();
  });

  it('should return a list of filenames based on a sentence and a list of instruments', async () => {
    // Given
    const sentence_OK: string = 'P (Ts P) Ts .';
    // When
    const result: string[] =
      await sequenceService.prepareFileNames(sentence_OK);
    // Then
    const expectedResult: string[] = ['kickdrum.mp3', 'hihat.mp3'];
    expect(result).toEqual(expectedResult);
  });

  it('should throw an error because one of the symbols in the sentence does not match any instrument', async () => {
    // Given
    const sentence_KO: string = 'P (Ts K) Ts .';
    // When - Then
    expect(sequenceService.prepareFileNames(sentence_KO)).rejects.toThrow(
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
    const sentence_OK: string = 'P (Ts P) Ts .';
    // When
    const result: SequenceNotes[] =
      await sequenceService.preparePattern(sentence_OK);
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
    const sentence_KO: string = 'P (Ts K) Ts .';
    // When - Then
    expect(sequenceService.preparePattern(sentence_KO)).rejects.toThrow(
      `Le symbole K n'existe pas.`,
    );
  });
});
