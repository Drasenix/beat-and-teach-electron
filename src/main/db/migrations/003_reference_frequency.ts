import Database from 'better-sqlite3';

export default function runMigration003(db: Database.Database): void {
  try {
    db.exec(`ALTER TABLE instruments ADD COLUMN reference_frequency REAL;`);
  } catch {
    // colonne déjà existante
  }
}
