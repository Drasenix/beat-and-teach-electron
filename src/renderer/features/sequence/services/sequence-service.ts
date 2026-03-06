import { removeParenthesis, removeDuplicates } from '../../../utils/util';
import { InstrumentEngine } from '../../instruments/engine/instrument-engine';
import { SequenceNotes, SequenceNote } from '../types/sequence-note';

export async function prepareFileNames(sentence: string): Promise<string[]> {
  const instrumentController: InstrumentEngine =
    await InstrumentEngine.getInstance();

  const sentenceWithOnlyInstruments: string = removeParenthesis(sentence);
  const symbols: string[] = removeDuplicates(
    sentenceWithOnlyInstruments.split(' '),
  );
  const fileNames: string[] = symbols.flatMap((symbol) => {
    return instrumentController.getInstrumentFileNameFromSymbol(symbol);
  });
  return fileNames;
}

export async function preparePattern(
  sentence: string,
): Promise<SequenceNotes[]> {
  const instrumentController: InstrumentEngine =
    await InstrumentEngine.getInstance();
  const result: SequenceNotes[] = [];
  const regex = /\(([^)]*)\)|(\S+)/g; // "hello (world foo) bar" --> ["hello", "(world foo)", "bar"]
  let match: RegExpExecArray | null;

  while ((match = regex.exec(sentence)) !== null) {
    if (match[1] !== undefined) {
      // Groupe 1 : contenu entre parenthèses
      const symbols: string[] = match[1].trim().split(/\s+/);
      const notes: SequenceNote[] = symbols.map((symbol) =>
        instrumentController.getInstrumentNameFromSymbol(symbol),
      );
      result.push(notes);
    } else {
      // Groupe 2 : token simple
      let symbols: string = match[2];
      result.push(instrumentController.getInstrumentNameFromSymbol(symbols));
    }
  }

  return result;
}
