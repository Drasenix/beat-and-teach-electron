import { ipcMain } from 'electron';
import { getAudioBuffersFromFiles } from './services/system/audio-file-service';
import { PatternDB } from './services/db/models/pattern-db';
import fetchAllPatterns from './services/db/services/fetch-patterns';
import { InstrumentDB } from './services/db/models/instrument-db';
import fetchAllInstruments from './services/db/services/fetch-instruments';

export default function createIcpEvents() {
  ipcMain.handle(
    'get-audio-buffers',
    async (
      event,
      filenames: string[],
    ): Promise<(ArrayBuffer | SharedArrayBuffer)[]> => {
      return getAudioBuffersFromFiles(filenames);
    },
  );

  ipcMain.handle('get-all-patterns', async (): Promise<PatternDB[]> => {
    return fetchAllPatterns();
  });

  ipcMain.handle('get-all-instruments', async (): Promise<InstrumentDB[]> => {
    return fetchAllInstruments();
  });
}
