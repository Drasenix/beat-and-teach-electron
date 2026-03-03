import { Instrument } from '../models/instrument-model';
import * as instrumentService from '../services/instrument-service';

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

describe('#getFilesToLoadFromSentence', () => {
  it('should return a list of filenames based on a sentence and a list of instruments', () => {
    // Given
    const sentence_OK: string = 'P Ts P Ts';
    // When
    const result: string[] = instrumentService.getFilesToLoadFromSentence(
      sentence_OK,
      instruments,
    );
    // Then
    const expectedResult: string[] = ['kickdrum.mp3', 'hihat.mp3'];
    expect(result).toEqual(expectedResult);
  });

  it('should throw an error because one of the symbols in the sentence does not match any instrument', () => {
    // Given
    const sentence_KO: string = 'P Ts K Ts';
    // When - Then
    expect(() =>
      instrumentService.getFilesToLoadFromSentence(sentence_KO, instruments),
    ).toThrow(`Le symbole K n'existe pas.`);
  });
});

describe('#getPatternFromSentence', () => {
  it('should return a list of symbols based on a sentence and a list of instruments', () => {
    // Given
    const sentence_OK: string = 'P Ts P Ts';
    // When
    const result: string[] = instrumentService.getPatternFromSentence(
      sentence_OK,
      instruments,
    );
    // Then
    const expectedResult: string[] = ['kickdrum', 'hihat', 'kickdrum', 'hihat'];
    expect(result).toEqual(expectedResult);
  });

  it('should throw an error because on of the symbols in the sentence does not match any instrument', () => {
    // Given
    const sentence_KO: string = 'P Ts K Ts';
    // When - Then
    expect(() =>
      instrumentService.getPatternFromSentence(sentence_KO, instruments),
    ).toThrow(`Le symbole K n'existe pas.`);
  });
});
