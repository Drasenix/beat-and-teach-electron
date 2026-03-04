import { InstrumentDB } from '../../../../main/db/models/instrument-db';
import { removeDuplicates, removeParenthesis } from '../../../utils/util';
import adaptInstruments from '../models/instrument-adapter';
import { Instrument } from '../models/instrument-model';

export type NoteItem = string | string[];

export async function getAllInstruments(): Promise<Instrument[]> {
  const instruments: InstrumentDB[] =
    await window.electron.ipcRenderer.invokeMessage('get-all-instruments');
  return adaptInstruments(instruments);
}

export function getFilesToLoadFromSentence(
  sentence: string,
  instruments: Instrument[],
): string[] {
  const sentenceWithoutParenthesis: string = removeParenthesis(sentence);
  const symbols: string[] = removeDuplicates(
    sentenceWithoutParenthesis.split(' '),
  );
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

export function getInstrumentNameFromSymbol(
  symbol: string,
  instruments: Instrument[],
): string {
  const instru: Instrument | undefined = instruments.find(
    (instrument: Instrument) => instrument.symbol === symbol,
  );
  if (instru) {
    return instru.name;
  }
  throw new Error(`Le symbole ${symbol} n'existe pas.`);
}

export function getPatternFromSentence(
  sentence: string,
  instruments: Instrument[],
): NoteItem[] {
  const result: NoteItem[] = [];
  const regex = /\(([^)]*)\)|(\S+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(sentence)) !== null) {
    if (match[1] !== undefined) {
      // Groupe 1 : contenu entre parenthèses
      const symbols: NoteItem = match[1].trim().split(/\s+/);
      for (const index in symbols) {
        symbols[index] = getInstrumentNameFromSymbol(
          symbols[index],
          instruments,
        );
      }
      result.push(symbols);
    } else {
      // Groupe 2 : token simple
      let symbols: NoteItem = match[2];
      symbols = getInstrumentNameFromSymbol(symbols, instruments);
      result.push(symbols);
    }
  }

  return result;
}
