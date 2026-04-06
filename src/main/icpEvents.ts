import { app, dialog, ipcMain } from 'electron';
import path from 'path';
import { getAudioBuffersFromFiles } from './audio/services/audio-service';
import { PatternDTO } from '../shared/models/pattern-dto';
import fetchAllPatterns from './db/services/fetch-patterns';
import { InstrumentDTO } from '../shared/models/instrument-dto';
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
import exportLibrary from './library/export-library';
import { parseLibraryFile, importLibrary } from './library/import-library';
import {
  ExportLibraryRequest,
  ImportLibraryRequest,
  LibraryManifest,
  ImportResult,
} from '../shared/models/library-dto';

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

  ipcMain.handle('get-all-patterns', async (): Promise<PatternDTO[]> => {
    return fetchAllPatterns();
  });

  ipcMain.handle(
    'create-pattern',
    async (
      event,
      pattern: Omit<PatternDTO, 'id' | 'slug'>,
    ): Promise<PatternDTO> => {
      return createPattern(pattern);
    },
  );

  ipcMain.handle(
    'update-pattern',
    async (
      event,
      id: number,
      pattern: Partial<Omit<PatternDTO, 'id'>>,
    ): Promise<PatternDTO> => {
      return updatePattern(id, pattern);
    },
  );

  ipcMain.handle('delete-pattern', async (event, id: number): Promise<void> => {
    return deletePattern(id);
  });

  // Instruments

  ipcMain.handle('get-all-instruments', async (): Promise<InstrumentDTO[]> => {
    return fetchAllInstruments();
  });

  ipcMain.handle(
    'create-instrument',
    async (
      event,
      instrument: Omit<InstrumentDTO, 'id' | 'slug'>,
    ): Promise<InstrumentDTO> => {
      return createInstrument(instrument);
    },
  );

  ipcMain.handle(
    'update-instrument',
    async (
      event,
      id: number,
      instrument: Partial<Omit<InstrumentDTO, 'id'>>,
    ): Promise<InstrumentDTO> => {
      return updateInstrument(id, instrument);
    },
  );

  ipcMain.handle(
    'delete-instrument',
    async (event, id: number): Promise<void> => {
      return deleteInstrument(id);
    },
  );

  // Library

  ipcMain.handle(
    'export-library',
    async (event, request: ExportLibraryRequest): Promise<string> => {
      return exportLibrary(
        request.patternIds,
        request.instrumentIds,
        request.outputPath,
      );
    },
  );

  ipcMain.handle(
    'parse-library-file',
    async (event, zipPath: string): Promise<LibraryManifest> => {
      return parseLibraryFile(zipPath);
    },
  );

  ipcMain.handle(
    'import-library',
    async (event, request: ImportLibraryRequest): Promise<ImportResult> => {
      return importLibrary(
        request.zipPath,
        request.conflictResolutions,
        request.audioDestPath,
      );
    },
  );

  ipcMain.handle('save-library-file', async (): Promise<string | null> => {
    const result = await dialog.showSaveDialog({
      title: 'Exporter la bibliothèque',
      defaultPath: 'bibliotheque.beatpack',
      filters: [{ name: 'BeatPack', extensions: ['beatpack'] }],
    });
    return result.canceled ? null : result.filePath;
  });

  ipcMain.handle('open-library-file', async (): Promise<string | null> => {
    const result = await dialog.showOpenDialog({
      title: 'Importer une bibliothèque',
      properties: ['openFile'],
      filters: [{ name: 'BeatPack', extensions: ['beatpack'] }],
    });
    return result.canceled ? null : result.filePaths[0];
  });

  ipcMain.handle('get-imported-audio-path', async (): Promise<string> => {
    return path.join(app.getPath('userData'), 'imported-audio');
  });
}
