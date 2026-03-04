import { removeParenthesis, removeDuplicates } from '../../../utils/util';
import { getAllInstruments } from '../services/instrument-service';
import { NoteItem } from '../types/note-item';
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
    const sentenceWithoutParenthesis: string = removeParenthesis(sentence);
    const symbols: string[] = removeDuplicates(
      sentenceWithoutParenthesis.split(' '),
    );
    const fileNames: string[] = symbols.flatMap((symbol) => {
      const instru: Instrument | undefined = this.instruments.find(
        (instrument: Instrument) => instrument.symbol === symbol,
      );
      if (instru) {
        return instru.filename;
      }
      throw new Error(`Le symbole ${symbol} n'existe pas.`);
    });
    return fileNames;
  }

  getInstrumentNameFromSymbol(symbol: string): string {
    const instru: Instrument | undefined = this.instruments.find(
      (instrument: Instrument) => instrument.symbol === symbol,
    );
    if (instru) {
      return instru.name;
    }
    throw new Error(`Le symbole ${symbol} n'existe pas.`);
  }

  getPatternFromSentence(sentence: string): NoteItem[] {
    const result: NoteItem[] = [];
    const regex = /\(([^)]*)\)|(\S+)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(sentence)) !== null) {
      if (match[1] !== undefined) {
        // Groupe 1 : contenu entre parenthèses
        const symbols: NoteItem = match[1].trim().split(/\s+/);
        for (const index in symbols) {
          symbols[index] = this.getInstrumentNameFromSymbol(symbols[index]);
        }
        result.push(symbols);
      } else {
        // Groupe 2 : token simple
        let symbols: NoteItem = match[2];
        symbols = this.getInstrumentNameFromSymbol(symbols);
        result.push(symbols);
      }
    }

    return result;
  }
}
