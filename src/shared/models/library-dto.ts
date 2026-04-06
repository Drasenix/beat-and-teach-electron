export type LibraryManifestVersion = 1;

export interface LibraryPattern {
  slug: string;
  name: string;
  sentences: string[];
  highlights: (string | null)[][];
}

export interface LibraryInstrument {
  slug: string;
  symbol: string;
  name: string | null;
  audioFile: string;
}

export interface LibraryManifest {
  version: LibraryManifestVersion;
  exportDate: string;
  patterns: LibraryPattern[];
  instruments: LibraryInstrument[];
}

export type ConflictAction = 'overwrite' | 'skip' | 'rename';

export interface ConflictResolution {
  type: 'pattern' | 'instrument';
  slug: string;
  action: ConflictAction;
  newName?: string;
}

export interface ImportResult {
  importedPatterns: number;
  importedInstruments: number;
  skippedPatterns: number;
  skippedInstruments: number;
  errors: string[];
}

export interface ExportLibraryRequest {
  patternIds: number[];
  instrumentIds: number[];
  outputPath: string;
}

export interface ImportLibraryRequest {
  zipPath: string;
  conflictResolutions: ConflictResolution[];
  audioDestPath: string;
}
