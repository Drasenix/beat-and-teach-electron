import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import {
  LibraryManifest,
  LibraryInstrument,
  LibraryPattern,
} from '../../shared/models/library-dto';
import { PatternDTO } from '../../shared/models/pattern-dto';
import { InstrumentDTO } from '../../shared/models/instrument-dto';
import { getPatternsByIds } from '../db/repositories/pattern-repository';
import { getInstrumentsByIds } from '../db/repositories/instrument-repository';

function toLibraryPattern(db: PatternDTO): LibraryPattern {
  return {
    slug: db.slug,
    name: db.name,
    sentences: JSON.parse(db.sentences) as string[],
    highlights: JSON.parse(db.highlights) as (string | null)[][],
  };
}

function toLibraryInstrument(
  db: InstrumentDTO,
  audioFileName: string,
): LibraryInstrument {
  return {
    slug: db.slug,
    symbol: db.symbol,
    name: db.name,
    audioFile: `audio/${audioFileName}`,
  };
}

export async function exportLibrary(
  patternIds: number[],
  instrumentIds: number[],
  outputPath: string,
): Promise<string> {
  const patterns = getPatternsByIds(patternIds);
  const instruments = getInstrumentsByIds(instrumentIds);

  const libraryPatterns = patterns.map(toLibraryPattern);

  const libraryInstruments: LibraryInstrument[] = [];
  const audioFiles: { filepath: string; archiveName: string }[] = [];

  for (const inst of instruments) {
    if (!inst.filepath || !fs.existsSync(inst.filepath)) continue;

    const ext = path.extname(inst.filepath);
    const archiveName = `${inst.slug}${ext}`;
    libraryInstruments.push(toLibraryInstrument(inst, archiveName));
    audioFiles.push({ filepath: inst.filepath, archiveName });
  }

  const manifest: LibraryManifest = {
    version: 1,
    exportDate: new Date().toISOString(),
    patterns: libraryPatterns,
    instruments: libraryInstruments,
  };

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 0 } });

    output.on('close', () => resolve(outputPath));
    archive.on('error', (err) => reject(err));

    archive.pipe(output);

    archive.append(JSON.stringify(manifest, null, 2), {
      name: 'manifest.json',
    });

    for (const { filepath, archiveName } of audioFiles) {
      archive.file(filepath, { name: `audio/${archiveName}` });
    }

    archive.finalize();
  });
}
