import { InstrumentDB } from '../../../../main/db/models/instrument-db';
import removeDuplicates from '../../../util';
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

export function assertSymbolMatchingInstrument(
  symbol: string,
  instruments: Instrument[],
): void {
  const instru: Instrument | undefined = instruments.find(
    (instrument: Instrument) => instrument.symbol === symbol,
  );
  if (!instru) {
    throw new Error(`Le symbole ${symbol} n'existe pas.`);
  }
}

export function getPatternFromSentenceV2(
  sentence: string,
  instruments: Instrument[],
): NoteItem[] {
  const result: NoteItem[] = [];
  const regex = /\(([^)]*)\)|(\S+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(sentence)) !== null) {
    if (match[1] !== undefined) {
      // Groupe 1 : contenu entre parenthèses
      const notes: NoteItem = match[1].trim().split(/\s+/);
      for (const index in notes) {
        assertSymbolMatchingInstrument(notes[index], instruments);
      }
      result.push(notes);
    } else {
      // Groupe 2 : token simple
      const note: NoteItem = match[2];
      assertSymbolMatchingInstrument(note, instruments);
      result.push(match[2]);
    }
  }

  return result;
}
