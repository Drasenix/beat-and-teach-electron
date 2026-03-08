import { removeParenthesis, removeDuplicates } from '../../../utils/util';
import {
  getInstrumentFilePathsFromSymbol,
  getInstrumentNameFromSymbol,
} from '../../instruments/facade/instrument-facade';
import { InstrumentFilePath } from '../../../../shared/types/instrument-file-path';
import { SequenceNotes, SequenceNote } from '../types/sequence-note';

export async function prepareFilePaths(
  sentence: string,
): Promise<InstrumentFilePath[]> {
  const sentenceWithOnlyInstruments: string = removeParenthesis(sentence);
  const symbols: string[] = removeDuplicates(
    sentenceWithOnlyInstruments.split(' '),
  );
  const resolved: InstrumentFilePath[][] = await Promise.all(
    symbols.map((symbol) => getInstrumentFilePathsFromSymbol(symbol)),
  );
  return resolved.flat();
}

export async function preparePattern(
  sentence: string,
): Promise<SequenceNotes[]> {
  const result: SequenceNotes[] = [];
  const regex = /\(([^)]*)\)|(\S+)/g; // "hello (world foo) bar" --> ["hello", "(world foo)", "bar"]
  let match: RegExpExecArray | null;

  while ((match = regex.exec(sentence)) !== null) {
    if (match[1] !== undefined) {
      // Groupe 1 : contenu entre parenthèses
      const symbols: string[] = match[1].trim().split(/\s+/);
      const notes: SequenceNote[] = await Promise.all(
        symbols.map((symbol) => getInstrumentNameFromSymbol(symbol)),
      );
      result.push(notes);
    } else {
      // Groupe 2 : token simple
      let symbols: string = match[2];
      result.push(await getInstrumentNameFromSymbol(symbols));
    }
  }

  return result;
}
