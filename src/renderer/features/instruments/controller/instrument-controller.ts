import { getAllInstruments } from '../services/instrument-service';
import { Instrument } from '../models/instrument-model';
import { InstrumentFile } from '../types/instrument-file';

export class InstrumentController {
  static #instance: InstrumentController;
  private _instruments: Instrument[] = [];

  public set instruments(value: Instrument[]) {
    this._instruments = value;
  }

  public get instruments(): Instrument[] {
    return this._instruments;
  }

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

  public getInstrumentFileNameFromSymbol(
    symbol: string,
  ): string | never[] {
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
