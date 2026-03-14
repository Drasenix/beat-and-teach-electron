import { toSnakeCase } from '../../../renderer/utils/util';
import { PatternDB } from '../../../shared/models/pattern-db';
import getDatabase from '../database';

export function getAllPatterns(): PatternDB[] {
  const db = getDatabase();
  return db
    .prepare('SELECT id, slug, name, sentences FROM patterns')
    .all() as PatternDB[];
}

export function getPatternById(id: number): PatternDB | undefined {
  const db = getDatabase();
  return db
    .prepare('SELECT id, slug, name, sentences FROM patterns WHERE id = ?')
    .get(id) as PatternDB | undefined;
}

export function createPattern(
  pattern: Omit<PatternDB, 'id' | 'slug'>,
): PatternDB {
  if (!pattern.name?.trim()) throw new Error('Le nom est requis.');
  if (!pattern.sentences) throw new Error('Les phrases sont requises.');

  const db = getDatabase();
  const slug = toSnakeCase(pattern.name);
  const sentence = JSON.parse(pattern.sentences)[0] ?? '';

  try {
    const result = db
      .prepare(
        `INSERT INTO patterns (slug, name, sentences)
         VALUES (@slug, @name, @sentences)`,
      )
      .run({ ...pattern, slug, sentence });
    return getPatternById(result.lastInsertRowid as number)!;
  } catch (error: any) {
    if (error?.message?.includes('UNIQUE constraint failed: patterns.slug')) {
      throw new Error('Un pattern avec ce nom existe déjà.');
    }
    throw error;
  }
}

export function updatePattern(
  id: number,
  pattern: Partial<Omit<PatternDB, 'id'>>,
): PatternDB {
  if (pattern.name !== undefined && !pattern.name?.trim())
    throw new Error('Le nom est requis.');
  if (pattern.sentences !== undefined && !pattern.sentences)
    throw new Error('Les phrases sont requises.');

  const db = getDatabase();
  const slug = pattern.name ? toSnakeCase(pattern.name) : undefined;
  const sentence = pattern.sentences
    ? (JSON.parse(pattern.sentences)[0] ?? undefined)
    : undefined;

  try {
    db.prepare(
      `UPDATE patterns
       SET slug      = COALESCE(@slug, slug),
           name      = COALESCE(@name, name),
           sentences = COALESCE(@sentences, sentences)
       WHERE id = @id`,
    ).run({ ...pattern, slug, sentence, id });
    return getPatternById(id)!;
  } catch (error: any) {
    if (error?.message?.includes('UNIQUE constraint failed: patterns.slug')) {
      throw new Error('Un pattern avec ce nom existe déjà.');
    }
    throw error;
  }
}

export function deletePattern(id: number): void {
  const db = getDatabase();
  db.prepare('DELETE FROM patterns WHERE id = ?').run(id);
}
