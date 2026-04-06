import { toSnakeCase } from '../../../renderer/utils/util';
import { InstrumentDTO } from '../../../shared/models/instrument-dto';
import getDatabase from '../database';

export function getAllInstruments(): InstrumentDTO[] {
  const db = getDatabase();
  return db
    .prepare('SELECT id, slug, symbol, name, filepath FROM instruments')
    .all() as InstrumentDTO[];
}

export function getInstrumentById(id: number): InstrumentDTO | undefined {
  const db = getDatabase();
  return db
    .prepare(
      'SELECT id, slug, symbol, name, filepath FROM instruments WHERE id = ?',
    )
    .get(id) as InstrumentDTO | undefined;
}

export function getInstrumentsByIds(ids: number[]): InstrumentDTO[] {
  if (ids.length === 0) return [];
  const db = getDatabase();
  const placeholders = ids.map(() => '?').join(',');
  return db
    .prepare(
      `SELECT id, slug, symbol, name, filepath FROM instruments WHERE id IN (${placeholders})`,
    )
    .all(...ids) as InstrumentDTO[];
}

export function createInstrument(
  instrument: Omit<InstrumentDTO, 'id' | 'slug'>,
): InstrumentDTO {
  if (!instrument.symbol?.trim()) throw new Error('Le symbole est requis.');
  if (!instrument.name?.trim()) throw new Error('Le nom est requis.');
  if (!instrument.filepath?.trim())
    throw new Error('Le fichier audio est requis.');
  const db = getDatabase();
  const slug = toSnakeCase(instrument.name);
  try {
    const result = db
      .prepare(
        `
      INSERT INTO instruments (slug, symbol, name, filepath)
      VALUES (@slug, @symbol, @name, @filepath)
    `,
      )
      .run({ ...instrument, slug });
    return getInstrumentById(result.lastInsertRowid as number)!;
  } catch (error: any) {
    if (
      error?.message?.includes('UNIQUE constraint failed: instruments.symbol')
    ) {
      throw new Error('Un instrument avec ce symbole existe déjà.');
    }
    if (
      error?.message?.includes('UNIQUE constraint failed: instruments.slug')
    ) {
      throw new Error('Un instrument avec ce nom existe déjà.');
    }
    throw error;
  }
}

export function updateInstrument(
  id: number,
  instrument: Partial<Omit<InstrumentDTO, 'id'>>,
): InstrumentDTO {
  if (instrument.symbol !== undefined && !instrument.symbol?.trim())
    throw new Error('Le symbole est requis.');
  if (instrument.name !== undefined && !instrument.name?.trim())
    throw new Error('Le nom est requis.');
  if (instrument.filepath !== undefined && !instrument.filepath?.trim())
    throw new Error('Le fichier audio est requis.');

  const db = getDatabase();
  const slug = instrument.name ? toSnakeCase(instrument.name) : undefined;

  try {
    db.prepare(
      `UPDATE instruments
       SET slug     = COALESCE(@slug, slug),
           symbol   = COALESCE(@symbol, symbol),
           name     = COALESCE(@name, name),
           filepath = COALESCE(@filepath, filepath)
       WHERE id = @id`,
    ).run({ ...instrument, slug, id });
    return getInstrumentById(id)!;
  } catch (error: any) {
    if (
      error?.message?.includes('UNIQUE constraint failed: instruments.symbol')
    ) {
      throw new Error('Un instrument avec ce symbole existe déjà.');
    }
    if (
      error?.message?.includes('UNIQUE constraint failed: instruments.slug')
    ) {
      throw new Error('Un instrument avec ce nom existe déjà.');
    }
    throw error;
  }
}

export function deleteInstrument(id: number): void {
  const db = getDatabase();
  db.prepare('DELETE FROM instruments WHERE id = ?').run(id);
}
