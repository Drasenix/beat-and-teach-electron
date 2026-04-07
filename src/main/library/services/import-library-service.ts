import fs from 'fs';
import path from 'path';
import AdmZip, { IZipEntry } from 'adm-zip';
import { toSnakeCase } from '../../../renderer/utils/util';
import {
  LibraryManifest,
  ConflictResolution,
  ImportResult,
} from '../../../shared/models/library-dto';
import {
  createPattern,
  deletePattern,
} from '../../db/repositories/pattern-repository';
import {
  createInstrument,
  deleteInstrument,
} from '../../db/repositories/instrument-repository';
import fetchAllPatterns from '../../db/services/fetch-patterns';
import fetchAllInstruments from '../../db/services/fetch-instruments';
import { PatternDTO } from '../../../shared/models/pattern-dto';
import { InstrumentDTO } from '../../../shared/models/instrument-dto';

export function parseLibraryFile(zipPath: string): LibraryManifest {
  const zip: AdmZip = new AdmZip(zipPath);
  const manifestEntry: IZipEntry | null = zip.getEntry('manifest.json');
  if (!manifestEntry) {
    throw new Error('Fichier manifest.json introuvable dans le .beatpack');
  }
  const manifest: LibraryManifest = JSON.parse(
    manifestEntry.getData().toString('utf8'),
  );
  if (manifest.version !== 1) {
    throw new Error(`Version de manifest non supportée : ${manifest.version}`);
  }
  return manifest;
}

export async function importLibrary(
  zipPath: string,
  conflictResolutions: ConflictResolution[],
  audioDestPath: string,
): Promise<ImportResult> {
  const manifest: LibraryManifest = parseLibraryFile(zipPath);
  const zip: AdmZip = new AdmZip(zipPath);

  const result: ImportResult = {
    importedPatterns: 0,
    importedInstruments: 0,
    skippedPatterns: 0,
    skippedInstruments: 0,
    errors: [],
  };

  if (!fs.existsSync(audioDestPath)) {
    fs.mkdirSync(audioDestPath, { recursive: true });
  }

  const existingPatterns: PatternDTO[] = fetchAllPatterns();
  const existingInstruments: InstrumentDTO[] = fetchAllInstruments();

  const patternResolutionMap: Map<string, ConflictResolution> = new Map<
    string,
    ConflictResolution
  >();
  const instrumentResolutionMap: Map<string, ConflictResolution> = new Map<
    string,
    ConflictResolution
  >();
  conflictResolutions.forEach((res) => {
    if (res.type === 'pattern') {
      patternResolutionMap.set(res.slug, res);
    } else {
      instrumentResolutionMap.set(res.slug, res);
    }
  });

  manifest.patterns.forEach((pat) => {
    const resolution: ConflictResolution | undefined = patternResolutionMap.get(
      pat.slug,
    );
    if (!resolution || resolution.action === 'skip') {
      result.skippedPatterns += 1;
      return;
    }

    if (resolution.action === 'rename' && resolution.newName) {
      pat.name = resolution.newName;
      pat.slug = toSnakeCase(resolution.newName);
    }

    const existing: PatternDTO | undefined = existingPatterns.find(
      (p) => p.slug === pat.slug,
    );
    if (existing) {
      deletePattern(existing.id);
    }

    try {
      createPattern({
        name: pat.name,
        sentences: JSON.stringify(pat.sentences),
        highlights: JSON.stringify(pat.highlights),
      });
      result.importedPatterns += 1;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      result.errors.push(`Pattern "${pat.name}" : ${msg}`);
      result.skippedPatterns += 1;
    }
  });

  manifest.instruments.forEach((inst) => {
    const resolution: ConflictResolution | undefined =
      instrumentResolutionMap.get(inst.slug);
    if (!resolution || resolution.action === 'skip') {
      result.skippedInstruments += 1;
      return;
    }

    let finalSlug = inst.slug;
    let finalName = inst.name;

    if (resolution.action === 'rename' && resolution.newName) {
      finalName = resolution.newName;
      finalSlug = toSnakeCase(resolution.newName);
    }

    const existingBySlug: InstrumentDTO | undefined = existingInstruments.find(
      (i) => i.slug === finalSlug,
    );
    const existingBySymbol: InstrumentDTO | undefined =
      existingInstruments.find((i) => i.symbol === inst.symbol);

    if (existingBySlug) {
      deleteInstrument(existingBySlug.id);
    }
    if (
      existingBySymbol &&
      (!existingBySlug || existingBySymbol.id !== existingBySlug.id)
    ) {
      deleteInstrument(existingBySymbol.id);
    }

    const audioFileName: string = path.basename(inst.audioFile);
    const destPath: string = path.join(audioDestPath, audioFileName);

    try {
      const audioEntry: IZipEntry | null = zip.getEntry(inst.audioFile);
      if (audioEntry) {
        fs.writeFileSync(destPath, audioEntry.getData());
      }

      createInstrument({
        symbol: inst.symbol,
        name: finalName,
        filepath: destPath,
      });
      result.importedInstruments += 1;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      result.errors.push(`Instrument "${finalName}" : ${msg}`);
      result.skippedInstruments += 1;
    }
  });

  return result;
}
