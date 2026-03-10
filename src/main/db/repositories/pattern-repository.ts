import { toSnakeCase } from '../../../renderer/utils/util';
import { PatternDB } from '../../../shared/models/pattern-db';
import { getDatabase } from '../database';

export function getAllPatterns(): PatternDB[] {
  const db = getDatabase();
  return db
    .prepare('SELECT id, slug, name, sentence FROM patterns')
    .all() as PatternDB[];
}

export function getPatternById(id: number): PatternDB | undefined {
  const db = getDatabase();
  return db
    .prepare('SELECT id, slug, name, sentence FROM patterns WHERE id = ?')
    .get(id) as PatternDB | undefined;
}

export function createPattern(
  pattern: Omit<PatternDB, 'id' | 'slug'>,
): PatternDB {
  if (!pattern.name?.trim()) throw new Error('Le nom est requis.');
  if (!pattern.sentence?.trim()) throw new Error('La phrase est requise.');
  const db = getDatabase();
  const slug = toSnakeCase(pattern.name);
  const result = db
    .prepare(
      `
  INSERT INTO patterns (slug, name, sentence)
  VALUES (@slug, @name, @sentence)
`,
    )
    .run({ ...pattern, slug });
  return getPatternById(result.lastInsertRowid as number)!;
}

export function updatePattern(
  id: number,
  pattern: Partial<Omit<PatternDB, 'id'>>,
): PatternDB {
  const db = getDatabase();
  db.prepare(
    `
  UPDATE patterns
  SET slug     = COALESCE(@slug, slug),
      name     = COALESCE(@name, name),
      sentence = COALESCE(@sentence, sentence)
  WHERE id = @id
`,
  ).run({ ...pattern, id });
  return getPatternById(id)!;
}

export function deletePattern(id: number): void {
  const db = getDatabase();
  db.prepare('DELETE FROM patterns WHERE id = ?').run(id);
}
