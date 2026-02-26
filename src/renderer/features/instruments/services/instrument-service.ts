import { InstrumentDB } from '../../../../main/db/models/instrument-db';
import adaptInstruments from '../models/instrument-adapter';
import { Instrument } from '../models/instrument-model';

export default async function getAllInstruments(): Promise<Instrument[]> {
  const instruments: InstrumentDB[] =
    await window.electron.ipcRenderer.invokeMessage('get-all-instruments');
  return adaptInstruments(instruments);
}
