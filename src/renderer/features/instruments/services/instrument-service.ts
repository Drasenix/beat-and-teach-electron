import { InstrumentDB } from '../../../../main/db/models/instrument-db';
import adaptInstruments from '../models/instrument-adapter';

export async function getAllInstruments() {
  const instruments: InstrumentDB[] =
    await window.electron.ipcRenderer.invokeMessage('get-all-instruments');

  return adaptInstruments(instruments);
}
