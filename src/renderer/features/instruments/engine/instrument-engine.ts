import { Instrument } from '../models/instrument-model';
import {
  InstrumentFilePath,
  InstrumentName,
} from '../../../../shared/types/instrument';

export default class InstrumentEngine {
  // eslint-disable-next-line no-use-before-define
  static #instance: InstrumentEngine;

  private instruments: Instrument[] = [];

  private initialized = false;

  public get isInitialized(): boolean {
    return this.initialized;
  }

  public static getInstance(): InstrumentEngine {
    if (!InstrumentEngine.#instance) {
      InstrumentEngine.#instance = new InstrumentEngine();
    }
    return InstrumentEngine.#instance;
  }

  public loadInstruments(instruments: Instrument[]): void {
    this.instruments = instruments;
    this.initialized = true;
  }

  public getInstrumentFilePathsFromSymbol(
    symbol: string,
  ): InstrumentFilePath[] {
    const instru = this.instruments.find((i) => i.symbol === symbol);
    if (instru) {
      return [{ name: instru.name, filepath: instru.filepath }];
    }
    throw new Error(`Le symbole ${symbol} n'existe pas.`);
  }

  public getInstrumentNameFromSymbol(symbol: string): InstrumentName {
    const instru: Instrument | undefined = this.instruments.find(
      (instrument: Instrument) => instrument.symbol === symbol,
    );
    if (instru) {
      return instru.name;
    }
    throw new Error(`Le symbole ${symbol} n'existe pas.`);
  }
}
