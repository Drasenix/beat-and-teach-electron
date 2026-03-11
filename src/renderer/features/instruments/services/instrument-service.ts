import { InstrumentDB } from '../../../../shared/models/instrument-db';
import adaptInstruments from '../adapters/instrument-adapter';
import { Instrument } from '../models/instrument-model';

export async function getAllInstruments(): Promise<Instrument[]> {
  const instruments: InstrumentDB[] =
    await window.electron.ipcRenderer.invokeMessage('get-all-instruments');

  return adaptInstruments(instruments);
}

export async function createInstrumentAPI(
  instrument: Omit<InstrumentDB, 'id' | 'slug'>,
): Promise<InstrumentDB> {
  return window.electron.ipcRenderer.invokeMessage(
    'create-instrument',
    instrument,
  );
}

export async function updateInstrumentAPI(
  id: number,
  instrument: Partial<Omit<InstrumentDB, 'id' | 'slug'>>,
): Promise<InstrumentDB> {
  return window.electron.ipcRenderer.invokeMessage(
    'update-instrument',
    id,
    instrument,
  );
}

export async function deleteInstrumentAPI(id: number): Promise<void> {
  return window.electron.ipcRenderer.invokeMessage('delete-instrument', id);
}
