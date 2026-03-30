import Database from 'better-sqlite3';

function migrateHighlights(db: Database.Database): void {
  const patterns = db
    .prepare('SELECT id, sentences, highlights FROM patterns')
    .all() as {
    id: number;
    sentences: string;
    highlights: string | null;
  }[];

  const update = db.prepare(
    'UPDATE patterns SET highlights = @highlights WHERE id = @id',
  );

  const migrate = db.transaction(() => {
    patterns.forEach(({ id, sentences, highlights }) => {
      const parsedSentences: string[] = JSON.parse(sentences);

      // Récupérer les highlights existants s'ils existent
      const existingHighlights: (string | null)[][] = highlights
        ? JSON.parse(highlights)
        : [];

      const mergedHighlights: (string | null)[][] = parsedSentences.map(
        (sentence, sentenceIndex) => {
          const flatTokens = sentence
            .trim()
            .replace(/[()]/g, '')
            .split(/\s+/)
            .filter((t) => t.length > 0);

          const existingRow = existingHighlights[sentenceIndex];

          // Si une ligne existante a la bonne longueur, on la conserve
          if (existingRow && existingRow.length === flatTokens.length) {
            return existingRow;
          }

          // Sinon on crée une nouvelle ligne vide, en préservant
          // les valeurs existantes token par token si possible
          return flatTokens.map((_, tokenIndex) =>
            existingRow?.[tokenIndex] !== undefined
              ? existingRow[tokenIndex]
              : null,
          );
        },
      );

      update.run({ id, highlights: JSON.stringify(mergedHighlights) });
    });
  });

  migrate();
}

export default function runMigration002(db: Database.Database): void {
  try {
    db.exec(`ALTER TABLE patterns ADD COLUMN highlights TEXT;`);
  } catch {
    // colonne déjà existante
  }

  migrateHighlights(db);
}
