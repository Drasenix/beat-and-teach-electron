import { removeParenthesis, removeDuplicates } from '../../../utils/util';
import {
  getInstrumentFilePathsFromSymbol,
  getInstrumentNameFromSymbol,
} from '../../instruments/facade/instrument-facade';
import { InstrumentFilePath } from '../../../../shared/types/instrument';
import { SequenceNotes, SequenceNote } from '../types/sequence-note';
import toSequenceNote from '../adapters/sequence-adapter';
import {
  tokenizeSentence,
  TokenMatch,
} from '../../../utils/sentence-tokenizer';

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

async function toSequenceNotes(token: TokenMatch): Promise<SequenceNotes> {
  if (token.group !== undefined) {
    return toGroupNotes(token.group);
  }
  return toSequenceNote(await getInstrumentNameFromSymbol(token.symbol ?? ''));
}

export async function preparePattern(
  sentence: string,
): Promise<SequenceNotes[]> {
  const tokens = tokenizeSentence(sentence);
  return Promise.all(tokens.map(toSequenceNotes));
}
