import { ipcMain } from 'electron';
import getAudioBufferFromFile from './services/system/audio-file-service';
import { PatternDB } from './services/db/models/pattern-db';
import fetchAllPatterns from './services/db/services/fetch-patterns';

export default function createIcpEvents() {
  ipcMain.handle(
    'get-audio-buffer',
    async (
      event,
      filename: string,
    ): Promise<ArrayBuffer | SharedArrayBuffer> => {
      return getAudioBufferFromFile(filename);
    },
  );

  ipcMain.handle('get-all-patterns', async (): Promise<PatternDB[]> => {
    return fetchAllPatterns();
  });
}
