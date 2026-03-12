import { dialog, ipcMain } from 'electron';
import { getAudioBuffersFromFiles } from './audio/services/audio-service';
import { PatternDB } from '../shared/models/pattern-db';
import fetchAllPatterns from './db/services/fetch-patterns';
import { InstrumentDB } from '../shared/models/instrument-db';
import fetchAllInstruments from './db/services/fetch-instruments';
import AudioFileBuffer from '../shared/types/audio-file-buffer';
import {
  createInstrument,
  updateInstrument,
  deleteInstrument,
} from './db/repositories/instrument-repository';
import {
  createPattern,
  updatePattern,
  deletePattern,
} from './db/repositories/pattern-repository';
import { InstrumentFilePath } from '../shared/types/instrument';

export default function createIcpEvents() {
  ipcMain.handle(
    'get-audio-buffers',
    async (
      event,
      filepaths: InstrumentFilePath[],
    ): Promise<AudioFileBuffer> => {
      return getAudioBuffersFromFiles(filepaths);
    },
  );
  ipcMain.handle('open-file-dialog', async (): Promise<string | null> => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg'] }],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  // Patterns

  ipcMain.handle('get-all-patterns', async (): Promise<PatternDB[]> => {
    return fetchAllPatterns();
  });

  ipcMain.handle(
    'create-pattern',
    async (
      event,
      pattern: Omit<PatternDB, 'id' | 'slug'>,
    ): Promise<PatternDB> => {
      return createPattern(pattern);
    },
  );

  ipcMain.handle(
    'update-pattern',
    async (
      event,
      id: number,
      pattern: Partial<Omit<PatternDB, 'id'>>,
    ): Promise<PatternDB> => {
      return updatePattern(id, pattern);
    },
  );

  ipcMain.handle('delete-pattern', async (event, id: number): Promise<void> => {
    return deletePattern(id);
  });

  // Instruments

  ipcMain.handle('get-all-instruments', async (): Promise<InstrumentDB[]> => {
    return fetchAllInstruments();
  });

  ipcMain.handle(
    'create-instrument',
    async (
      event,
      instrument: Omit<InstrumentDB, 'id' | 'slug'>,
    ): Promise<InstrumentDB> => {
      return createInstrument(instrument);
    },
  );

  ipcMain.handle(
    'update-instrument',
    async (
      event,
      id: number,
      instrument: Partial<Omit<InstrumentDB, 'id'>>,
    ): Promise<InstrumentDB> => {
      return updateInstrument(id, instrument);
    },
  );

  ipcMain.handle(
    'delete-instrument',
    async (event, id: number): Promise<void> => {
      return deleteInstrument(id);
    },
  );
}
