import { InstrumentDB } from '../../../../main/db/models/instrument-db';
import removeDuplicates from '../../../util';
import adaptInstruments from '../models/instrument-adapter';
import { Instrument } from '../models/instrument-model';

export async function getAllInstruments(): Promise<Instrument[]> {
  const instruments: InstrumentDB[] =
    await window.electron.ipcRenderer.invokeMessage('get-all-instruments');
  return adaptInstruments(instruments);
}

export function getFilesToLoadFromSentence(
  sentence: string,
  instruments: Instrument[],
): string[] {
  const symbols: string[] = removeDuplicates(sentence.split(' '));
  const fileNames: string[] = symbols.flatMap((symbol) => {
    const instru: Instrument | undefined = instruments.find(
      (instrument: Instrument) => instrument.symbol === symbol,
    );
    if (instru) {
      return instru.filename;
    }
    throw new Error(`Le symbole ${symbol} n'existe pas.`);
  });
  return fileNames;
}

export function getPatternFromSentence(
  sentence: string,
  instruments: Instrument[],
): string[] {
  const symbols: string[] = sentence.split(' ');
  const patterns: string[] = symbols.flatMap((symbol) => {
    const instru: Instrument | undefined = instruments.find(
      (instrument: Instrument) => instrument.symbol === symbol,
    );
    if (instru) {
      return instru.name;
    }
    throw new Error(`Le symbole ${symbol} n'existe pas.`);
  });

  return patterns;
}
