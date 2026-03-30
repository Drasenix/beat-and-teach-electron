import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';
import runMigrations from './migrations/001_initial';
import runMigration002 from './migrations/002_highlights';

let db: Database.Database;

export default function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.join(app.getPath('userData'), 'database.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
    runMigration002(db);
  }
  return db;
}
