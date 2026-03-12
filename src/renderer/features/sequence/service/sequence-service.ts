import { removeParenthesis, removeDuplicates } from '../../../utils/util';
import {
  getInstrumentFilePathsFromSymbol,
  getInstrumentNameFromSymbol,
} from '../../instruments/facade/instrument-facade';
import { InstrumentFilePath } from '../../../../shared/types/instrument';
import { SequenceNotes, SequenceNote } from '../types/sequence-note';
import toSequenceNote from '../adapters/sequence-adapter';

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
  const regex = /\(([^)]*)\)|(\S+)/g; // "hello (world foo) bar" --> ["hello", "(world foo)", "bar"]
  const matches: RegExpExecArray[] = [];
  let match: RegExpExecArray | null = regex.exec(sentence);

  while (match !== null) {
    matches.push(match);
    match = regex.exec(sentence);
  }

  const result: SequenceNotes[] = await Promise.all(
    matches.map(async (m) => {
      if (m[1] !== undefined) {
        // Groupe 1 : plusieurs notes par temps
        const symbols: string[] = m[1].trim().split(/\s+/);
        const notes: SequenceNote[] = await Promise.all(
          symbols.map(async (symbol) =>
            toSequenceNote(await getInstrumentNameFromSymbol(symbol)),
          ),
        );
        return notes;
      }
      // Groupe 2 : une seule note
      return toSequenceNote(await getInstrumentNameFromSymbol(m[2]));
    }),
  );

  return result;
}
