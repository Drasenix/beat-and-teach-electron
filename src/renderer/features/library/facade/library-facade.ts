import {
  ConflictResolution,
  ExportLibraryRequest,
  ImportLibraryRequest,
  ImportResult,
  LibraryManifest,
} from '../../../../shared/models/library-dto';
import {
  exportLibraryAPI,
  importLibraryAPI,
  openLibraryFileDialog,
  parseLibraryFileAPI,
  saveLibraryFileDialog,
  getImportedAudioPath,
} from '../services/library-service';

export async function exportLibrary(
  patternIds: number[],
  instrumentIds: number[],
): Promise<void> {
  const outputPath = await saveLibraryFileDialog();
  if (!outputPath) return;
  const request: ExportLibraryRequest = {
    patternIds,
    instrumentIds,
    outputPath,
  };
  await exportLibraryAPI(request);
}

export async function parseLibraryFile(): Promise<LibraryManifest | null> {
  const zipPath = await openLibraryFileDialog();
  if (!zipPath) return null;
  return parseLibraryFileAPI(zipPath);
}

export async function importLibrary(
  zipPath: string,
  conflictResolutions: ConflictResolution[],
): Promise<ImportResult> {
  const audioDestPath = await getImportedAudioPath();
  const request: ImportLibraryRequest = {
    zipPath,
    conflictResolutions,
    audioDestPath,
  };
  return importLibraryAPI(request);
}
