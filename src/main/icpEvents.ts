import { ipcMain } from 'electron';
import { getAudioBuffersFromFiles } from './audio/services/audio-service';
import { PatternDB } from '../shared/models/pattern-db';
import fetchAllPatterns from './db/services/fetch-patterns';
import { InstrumentDB } from '../shared/models/instrument-db';
import fetchAllInstruments from './db/services/fetch-instruments';
import AudioFileBuffer from '../shared/types/audio-file-buffer';

export default function createIcpEvents() {
  ipcMain.handle(
    'get-audio-buffers',
    async (event, filenames: string[]): Promise<AudioFileBuffer> => {
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
