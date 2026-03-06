import { Instrument } from '../models/instrument-model';
import { InstrumentFile } from '../types/instrument-file';

export class InstrumentEngine {
  static #instance: InstrumentEngine;
  private _instruments: Instrument[] = [];
  private _initialized = false;

  public get isInitialized(): boolean {
    return this._initialized;
  }

  public set instruments(value: Instrument[]) {
    this._instruments = value;
  }

  public get instruments(): Instrument[] {
    return this._instruments;
  }

  public static getInstance(): InstrumentEngine {
    if (!InstrumentEngine.#instance) {
      InstrumentEngine.#instance = new InstrumentEngine();
    }
    return InstrumentEngine.#instance;
  }

  public loadInstruments(instruments: Instrument[]): void {
    this.instruments = instruments;
    this._initialized = true;
  }

  public getInstrumentFileNameFromSymbol(symbol: string): string | string[] {
    const instru: Instrument | undefined = this.instruments.find(
      (instrument: Instrument) => instrument.symbol === symbol,
    );
    if (instru) {
      return instru.filename ? instru.filename : [];
    }
    throw new Error(`Le symbole ${symbol} n'existe pas.`);
  }

  public getInstrumentNameFromSymbol(symbol: string): InstrumentFile {
    const instru: Instrument | undefined = this.instruments.find(
      (instrument: Instrument) => instrument.symbol === symbol,
    );
    if (instru) {
      return instru.name;
    }
    throw new Error(`Le symbole ${symbol} n'existe pas.`);
  }
}
