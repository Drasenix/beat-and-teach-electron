import {
  ExportLibraryRequest,
  ImportLibraryRequest,
  ImportResult,
  LibraryManifest,
} from '../../../../shared/models/library-dto';

export async function exportLibraryAPI(
  request: ExportLibraryRequest,
): Promise<string> {
  return window.electron.ipcRenderer.invokeMessage('export-library', request);
}

export async function parseLibraryFileAPI(
  zipPath: string,
): Promise<LibraryManifest> {
  return window.electron.ipcRenderer.invokeMessage(
    'parse-library-file',
    zipPath,
  );
}

export async function importLibraryAPI(
  request: ImportLibraryRequest,
): Promise<ImportResult> {
  return window.electron.ipcRenderer.invokeMessage('import-library', request);
}

export async function saveLibraryFileDialog(): Promise<string | null> {
  return window.electron.ipcRenderer.invokeMessage('save-library-file');
}

export async function openLibraryFileDialog(): Promise<string | null> {
  return window.electron.ipcRenderer.invokeMessage('open-library-file');
}

export async function getImportedAudioPath(): Promise<string> {
  return window.electron.ipcRenderer.invokeMessage('get-imported-audio-path');
}
