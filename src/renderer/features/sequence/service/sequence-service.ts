import { removeParenthesis, removeDuplicates } from '../../../utils/util';
import {
  getInstrumentFilePathsFromSymbol,
  getInstrumentNameFromSymbol,
  getInstrumentReferenceFrequencyFromSymbol,
} from '../../instruments/facade/instrument-facade';
import { InstrumentFilePath } from '../../../../shared/types/instrument';
import { SequenceNotes, SequenceNote } from '../types/sequence-note';
import toSequenceNote from '../adapters/sequence-adapter';
import { parseToken } from '../../../utils/token-parser';
import {
  tokenizeSentence,
  TokenMatch,
} from '../../../utils/sentence-tokenizer';

const DEFAULT_PLAYBACK_RATE = 1;
const DEFAULT_SEMITONE_OFFSET = 0;

async function computePlaybackRate(
  symbol: string,
  targetFrequency: number,
): Promise<{ playbackRate: number; semitoneOffset: number }> {
  const referenceFrequency: number | null =
    await getInstrumentReferenceFrequencyFromSymbol(symbol);
  if (referenceFrequency === null || referenceFrequency <= 0) {
    return {
      playbackRate: DEFAULT_PLAYBACK_RATE,
      semitoneOffset: DEFAULT_SEMITONE_OFFSET,
    };
  }
  const rate = targetFrequency / referenceFrequency;
  const clamped = Math.min(Math.max(rate, 0.25), 4);
  const semitoneOffset = Math.round(12 * Math.log2(clamped));
  return { playbackRate: clamped, semitoneOffset };
}

export async function prepareFilePaths(
  sentence: string,
): Promise<InstrumentFilePath[]> {
  const sentenceWithOnlyInstruments: string = removeParenthesis(sentence);
  const symbols: string[] = removeDuplicates(
    sentenceWithOnlyInstruments.split(' '),
  );
  const resolved: InstrumentFilePath[][] = await Promise.all(
    symbols.map((symbol) =>
      getInstrumentFilePathsFromSymbol(parseToken(symbol).symbol),
    ),
  );
  return resolved.flat();
}

async function toGroupNotes(group: string): Promise<SequenceNote[]> {
  const tokens = group.trim().split(/\s+/);
  return Promise.all(
    tokens.map(async (raw) => {
      const { symbol, frequency } = parseToken(raw);
      const computed = frequency
        ? await computePlaybackRate(symbol, frequency)
        : {
            playbackRate: DEFAULT_PLAYBACK_RATE,
            semitoneOffset: DEFAULT_SEMITONE_OFFSET,
          };
      return toSequenceNote(
        await getInstrumentNameFromSymbol(symbol),
        computed.playbackRate,
        computed.semitoneOffset,
      );
    }),
  );
}

async function toSequenceNotes(token: TokenMatch): Promise<SequenceNotes> {
  if (token.group !== undefined) {
    return toGroupNotes(token.group);
  }
  const raw: string = token.symbol ?? '';
  const { symbol, frequency } = parseToken(raw);
  const computed = frequency
    ? await computePlaybackRate(symbol, frequency)
    : {
        playbackRate: DEFAULT_PLAYBACK_RATE,
        semitoneOffset: DEFAULT_SEMITONE_OFFSET,
      };
  return toSequenceNote(
    await getInstrumentNameFromSymbol(symbol),
    computed.playbackRate,
    computed.semitoneOffset,
  );
}

export async function preparePattern(
  sentence: string,
): Promise<SequenceNotes[]> {
  const tokens = tokenizeSentence(sentence);
  return Promise.all(tokens.map(toSequenceNotes));
}
