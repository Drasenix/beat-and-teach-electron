import { removeParenthesis, removeDuplicates } from '../../../utils/util';
import { getAllInstruments } from '../services/instrument-service';
import { SequenceNote, SequenceNotes } from '../types/sequence-note';
import { Instrument } from '../models/instrument-model';

export class InstrumentController {
  static #instance: InstrumentController;
  private instruments: Instrument[] = [];

  public static async getInstance(): Promise<InstrumentController> {
    if (!InstrumentController.#instance) {
      InstrumentController.#instance = new InstrumentController();
      await InstrumentController.#instance.loadInstruments();
    }
    return InstrumentController.#instance;
  }

  protected async loadInstruments() {
    this.instruments = await getAllInstruments();
  }

  getFilesToLoadFromSentence(sentence: string): string[] {
    const sentenceWithOnlyInstruments: string = removeParenthesis(sentence);
    const symbols: string[] = removeDuplicates(
      sentenceWithOnlyInstruments.split(' '),
    );
    const fileNames: string[] = symbols.flatMap((symbol) => {
      const instru: Instrument | undefined = this.instruments.find(
        (instrument: Instrument) => instrument.symbol === symbol,
      );
      if (instru) {
        return instru.filename ? instru.filename : [];
      }
      throw new Error(`Le symbole ${symbol} n'existe pas.`);
    });
    return fileNames;
  }

  getInstrumentNameFromSymbol(symbol: string): SequenceNote {
    const instru: Instrument | undefined = this.instruments.find(
      (instrument: Instrument) => instrument.symbol === symbol,
    );
    if (instru) {
      return instru.name;
    }
    throw new Error(`Le symbole ${symbol} n'existe pas.`);
  }

  getPatternFromSentence(sentence: string): SequenceNotes[] {
    const result: SequenceNotes[] = [];
    const regex = /\(([^)]*)\)|(\S+)/g; // "hello (world foo) bar" --> ["hello", "(world foo)", "bar"]
    let match: RegExpExecArray | null;

    while ((match = regex.exec(sentence)) !== null) {
      if (match[1] !== undefined) {
        // Groupe 1 : contenu entre parenthèses
        const symbols: string[] = match[1].trim().split(/\s+/);
        const notes: SequenceNote[] = symbols.map((symbol: string) => {
          return this.getInstrumentNameFromSymbol(symbol);
        });
        result.push(notes);
      } else {
        // Groupe 2 : token simple
        let symbols: string = match[2];
        result.push(this.getInstrumentNameFromSymbol(symbols));
      }
    }

    return result;
  }
}
