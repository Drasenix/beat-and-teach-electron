import InstrumentEngine from '../engine/instrument-engine';
import { Instrument } from '../models/instrument-model';
import {
  createInstrumentAPI,
  deleteInstrumentAPI,
  getAllInstruments,
  updateInstrumentAPI,
} from '../services/instrument-service';
import { InstrumentFormValues } from '../types/instrument-types';
import {
  InstrumentFilePath,
  InstrumentName,
} from '../../../../shared/types/instrument';
import { adaptInstrument } from '../adapters/instrument-adapter';

async function prepareInstrumentEngine(): Promise<InstrumentEngine> {
  const instrumentEngine = InstrumentEngine.getInstance();
  if (!instrumentEngine.isInitialized) {
    const instruments = await getAllInstruments();
    instrumentEngine.loadInstruments(instruments);
  }
  return instrumentEngine;
}

async function refreshInstrumentEngine(): Promise<void> {
  const instrumentEngine = InstrumentEngine.getInstance();
  const instruments = await getAllInstruments();
  instrumentEngine.loadInstruments(instruments);
}

export async function getInstruments(): Promise<Instrument[]> {
  return getAllInstruments();
}

export async function getInstrumentNameFromSymbol(
  symbol: string,
): Promise<InstrumentName> {
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
  instrument: InstrumentFormValues,
): Promise<Instrument> {
  const created = await createInstrumentAPI({
    symbol: instrument.symbol,
    name: instrument.name,
    filepath: instrument.filepath,
  });
  refreshInstrumentEngine();
  return adaptInstrument(created);
}

export async function updateInstrument(
  id: number,
  instrument: Partial<InstrumentFormValues>,
): Promise<Instrument> {
  const updated = await updateInstrumentAPI(id, {
    symbol: instrument.symbol,
    name: instrument.name,
    filepath: instrument.filepath,
  });
  refreshInstrumentEngine();
  return adaptInstrument(updated);
}

export async function deleteInstrument(id: number): Promise<void> {
  await deleteInstrumentAPI(id);
  refreshInstrumentEngine();
}
