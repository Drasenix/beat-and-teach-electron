import { InstrumentEngine } from '../engine/instrument-engine';
import { Instrument } from '../models/instrument-model';
import { getAllInstruments } from '../services/instrument-service';
import { InstrumentFile } from '../types/instrument-file';

async function prepareInstrumentEngine(): Promise<InstrumentEngine> {
  const instrumentEngine = InstrumentEngine.getInstance();
  if (!instrumentEngine.isInitialized) {
    const instruments = await getAllInstruments();
    instrumentEngine.loadInstruments(instruments);
  }
  return instrumentEngine;
}

export async function getInstruments(): Promise<Instrument[]> {
  return await getAllInstruments();
}

export async function getInstrumentNameFromSymbol(
  symbol: string,
): Promise<InstrumentFile> {
  const instrumentEngine = await prepareInstrumentEngine();
  return instrumentEngine.getInstrumentNameFromSymbol(symbol);
}

export async function getInstrumentFileNameFromSymbol(
  symbol: string,
): Promise<string | string[]> {
  const instrumentEngine = await prepareInstrumentEngine();
  return instrumentEngine.getInstrumentFileNameFromSymbol(symbol);
}
