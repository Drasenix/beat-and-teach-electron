import { InstrumentController } from '../controller/instrument-controller';
import { Instrument } from '../models/instrument-model';
import * as instrumentService from '../services/instrument-service';
import { NoteItem } from '../types/note-item';
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
const instruments: Instrument[] = [instrumentOne, instrumentTwo];
let instrumentController: InstrumentController;

describe('#getFilesToLoadFromSentence', () => {
  beforeAll(async () => {
    jest
      .spyOn(instrumentService, 'getAllInstruments')
      .mockResolvedValue(instruments);
    instrumentController = await InstrumentController.getInstance();
  });

  it('should return a list of filenames based on a sentence and a list of instruments', async () => {
    // Given
    const sentence_OK: string = 'P (Ts P) Ts';
    // When
    const result: string[] =
      instrumentController.getFilesToLoadFromSentence(sentence_OK);
    // Then
    const expectedResult: string[] = ['kickdrum.mp3', 'hihat.mp3'];
    expect(result).toEqual(expectedResult);
  });

  it('should throw an error because one of the symbols in the sentence does not match any instrument', async () => {
    // Given
    const sentence_KO: string = 'P (Ts K) Ts';
    // When - Then
    expect(() =>
      instrumentController.getFilesToLoadFromSentence(sentence_KO),
    ).toThrow(`Le symbole K n'existe pas.`);
  });
});

describe('#getPatternFromSentence', () => {
  beforeAll(async () => {
    jest
      .spyOn(instrumentService, 'getAllInstruments')
      .mockResolvedValue(instruments);
    instrumentController = await InstrumentController.getInstance();
  });

  it('should return a list of symbols based on a sentence and a list of instruments', async () => {
    // Given
    const sentence_OK: string = 'P (Ts P) Ts';
    // When
    const result: NoteItem[] =
      instrumentController.getPatternFromSentence(sentence_OK);
    // Then
    const expected: NoteItem[] = ['kickdrum', ['hihat', 'kickdrum'], 'hihat'];
    expect(result).toEqual(expected);
  });

  it('should throw an error because on of the symbols in the sentence does not match any instrument', async () => {
    // Given
    const sentence_KO: string = 'P (Ts K) Ts';
    // When - Then
    expect(() =>
      instrumentController.getPatternFromSentence(sentence_KO),
    ).toThrow(`Le symbole K n'existe pas.`);
  });
});

describe('#getInstrumentNameFromSymbol', () => {
  it('should throw an error because the symbol does not match any instrument', async () => {
    // Given
    const symbol: string = 'K';
    // When - Then
    expect(() =>
      instrumentController.getInstrumentNameFromSymbol(symbol),
    ).toThrow(`Le symbole K n'existe pas.`);
  });
});
