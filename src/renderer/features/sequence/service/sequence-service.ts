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

async function toGroupNotes(group: string): Promise<SequenceNote[]> {
  const symbols = group.trim().split(/\s+/);
  return Promise.all(
    symbols.map(async (symbol) =>
      toSequenceNote(await getInstrumentNameFromSymbol(symbol)),
    ),
  );
}

async function toSequenceNotes(match: RegExpExecArray): Promise<SequenceNotes> {
  if (match[1] !== undefined) {
    return toGroupNotes(match[1]); // Groupe 1 : plusieurs notes par temps
  }
  return toSequenceNote(await getInstrumentNameFromSymbol(match[2])); // Groupe 2 : une seule note
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

  return Promise.all(matches.map(toSequenceNotes));
}
