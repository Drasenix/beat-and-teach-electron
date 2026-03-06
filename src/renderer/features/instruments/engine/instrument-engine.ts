import { Instrument } from '../models/instrument-model';
import { getAllInstruments } from '../services/instrument-service';
import { InstrumentFile } from '../types/instrument-file';

export class InstrumentEngine {
  static #instance: InstrumentEngine;
  private _instruments: Instrument[] = [];

  public set instruments(value: Instrument[]) {
    this._instruments = value;
  }

  public get instruments(): Instrument[] {
    return this._instruments;
  }

  public static async getInstance(): Promise<InstrumentEngine> {
    if (!InstrumentEngine.#instance) {
      InstrumentEngine.#instance = new InstrumentEngine();
      await InstrumentEngine.#instance.loadInstruments();
    }
    return InstrumentEngine.#instance;
  }

  protected async loadInstruments() {
    this.instruments = await getAllInstruments();
  }

  public getInstrumentFileNameFromSymbol(symbol: string): string | never[] {
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
