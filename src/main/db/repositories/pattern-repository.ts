import { toSnakeCase } from '../../../renderer/utils/util';
import { PatternDTO } from '../../../shared/models/pattern-dto';
import getDatabase from '../database';

function buildDefaultHighlights(sentences: string): string {
  const parsed: string[] = JSON.parse(sentences);
  const highlights: (string | null)[][] = parsed.map((sentence) => {
    const flatTokens = sentence
      .trim()
      .replace(/[()]/g, '')
      .split(/\s+/)
      .filter((t) => t.length > 0);
    return flatTokens.map(() => null);
  });
  return JSON.stringify(highlights);
}

export function getAllPatterns(): PatternDTO[] {
  const db = getDatabase();
  return db
    .prepare('SELECT id, slug, name, sentences, highlights FROM patterns')
    .all() as PatternDTO[];
}

export function getPatternById(id: number): PatternDTO | undefined {
  const db = getDatabase();
  return db
    .prepare(
      'SELECT id, slug, name, sentences, highlights FROM patterns WHERE id = ?',
    )
    .get(id) as PatternDTO | undefined;
}

export function getPatternsByIds(ids: number[]): PatternDTO[] {
  if (ids.length === 0) return [];
  const db = getDatabase();
  const placeholders = ids.map(() => '?').join(',');
  return db
    .prepare(
      `SELECT id, slug, name, sentences, highlights FROM patterns WHERE id IN (${placeholders})`,
    )
    .all(...ids) as PatternDTO[];
}

export function createPattern(
  pattern: Omit<PatternDTO, 'id' | 'slug'>,
): PatternDTO {
  if (!pattern.name?.trim()) throw new Error('Le nom est requis.');
  if (!pattern.sentences) throw new Error('Les phrases sont requises.');

  const db = getDatabase();
  const slug = toSnakeCase(pattern.name);
  const sentence = JSON.parse(pattern.sentences)[0] ?? '';
  const highlights =
    pattern.highlights ?? buildDefaultHighlights(pattern.sentences);

  try {
    const result = db
      .prepare(
        `INSERT INTO patterns (slug, name, sentences, highlights)
         VALUES (@slug, @name, @sentences, @highlights)`,
      )
      .run({ ...pattern, slug, sentence, highlights });
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
  pattern: Partial<Omit<PatternDTO, 'id'>>,
): PatternDTO {
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
       SET slug       = COALESCE(@slug, slug),
           name       = COALESCE(@name, name),
           sentences  = COALESCE(@sentences, sentences),
           highlights = COALESCE(@highlights, highlights)
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
