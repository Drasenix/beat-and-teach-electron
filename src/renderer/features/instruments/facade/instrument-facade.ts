import { InstrumentEngine } from '../engine/instrument-engine';
import { Instrument } from '../models/instrument-model';
import {
  createInstrumentAPI,
  getAllInstruments,
} from '../services/instrument-service';
import { InstrumentFile } from '../types/instrument-file';
import { InstrumentFilePath } from '../../../../shared/types/instrument-file-path';
import { InstrumentDB } from '../../../../shared/models/instrument-db';
import { adaptInstrument } from '../adapters/instrument-adapter';

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

export async function getInstrumentFilePathsFromSymbol(
  symbol: string,
): Promise<InstrumentFilePath[]> {
  const instrumentEngine = await prepareInstrumentEngine();
  return instrumentEngine.getInstrumentFilePathsFromSymbol(symbol);
}

export async function createInstrument(
  instrument: Omit<Instrument, 'id' | 'slug'>,
): Promise<Instrument> {
  const created = await createInstrumentAPI({
    symbol: instrument.symbol,
    name: instrument.name,
    filepath: instrument.filepath,
  });
  return adaptInstrument(created);
}
