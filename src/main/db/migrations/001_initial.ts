import Database from 'better-sqlite3';
import { app } from 'electron';
import path from 'path';

function seedPatterns(db: Database.Database): void {
  const SEED_PATTERNS = [
    {
      slug: 'drum-and-bass',
      name: 'drum and bass',
      sentences: JSON.stringify(['P Ts K P Ts K P .']),
    },
    {
      slug: 'dubstep',
      name: 'dubstep',
      sentences: JSON.stringify(['P (Ts P) Ts P K (Ts P) Ts P K Ts']),
    },
    {
      slug: 'funk',
      name: 'funk',
      sentences: JSON.stringify(['P Ts P Ts K Ts Ts K Ts K P K K P Ts K']),
    },
    {
      slug: 'reggae',
      name: 'reggae',
      sentences: JSON.stringify(['P (Ts K) (. K) . (Ts K) (. K)']),
    },
    {
      slug: 'jazz',
      name: 'jazz',
      sentences: JSON.stringify([
        'P (P Ts) (Ts P) (Ts Ts) (P K) . Ts (P Ts) (Ts P) K (. Ts) .',
      ]),
    },
    {
      slug: 'boom-bap',
      name: 'boom bap',
      sentences: JSON.stringify(['P K P P P Kch']),
    },
    {
      slug: '23',
      name: '2/3',
      sentences: JSON.stringify(['P Ts Pf', 'K (. K) .']),
    },
    {
      slug: '43',
      name: '4/3',
      sentences: JSON.stringify(['P Ts Pf Ts', 'K (. K . ) ( . . K) .']),
    },
  ];
  const { count } = db
    .prepare('SELECT COUNT(*) as count FROM patterns')
    .get() as {
    count: number;
  };

  if (count > 0) return; // ← ne seed qu'une seule fois

  const insert = db.prepare(
    'INSERT INTO patterns (slug, name, sentences) VALUES (@slug, @name, @sentences)',
  );

  const insertMany = db.transaction((patterns) => {
    patterns.forEach(
      (pattern: { slug: string; name: string; sentence: string }) =>
        insert.run(pattern),
    );
  });

  insertMany(SEED_PATTERNS);
}

function seedInstruments(db: Database.Database): void {
  const { count } = db
    .prepare('SELECT COUNT(*) as count FROM instruments')
    .get() as {
    count: number;
  };

  if (count > 0) return;

  const soundsPath = app.isPackaged
    ? path.join(process.resourcesPath, 'audio')
    : path.join(app.getAppPath(), 'assets', 'audio');

  const SEED_INSTRUMENTS = [
    { slug: 'silence', symbol: '.', name: null, filepath: null },
    {
      slug: 'kickdrum',
      symbol: 'P',
      name: 'kickdrum',
      filepath: path.join(soundsPath, 'kickdrum.mp3'),
    },
    {
      slug: 'hihat',
      symbol: 'Ts',
      name: 'hihat',
      filepath: path.join(soundsPath, 'hihat.mp3'),
    },
    {
      slug: 'snare',
      symbol: 'Pf',
      name: 'snare',
      filepath: path.join(soundsPath, 'snare.mp3'),
    },
    {
      slug: 'rimshot',
      symbol: 'K',
      name: 'rimshot',
      filepath: path.join(soundsPath, 'rimshot.mp3'),
    },
    {
      slug: 'sonic-boom',
      symbol: 'W',
      name: 'sonic boom',
      filepath: path.join(soundsPath, 'sonic-boom.mp3'),
    },
  ];

  const insert = db.prepare(`
    INSERT INTO instruments (slug, symbol, name, filepath)
    VALUES (@slug, @symbol, @name, @filepath)
  `);

  const insertMany = db.transaction((instruments) => {
    instruments.forEach(
      (instrument: {
        slug: string;
        symbol: string;
        name: string | null;
        filepath: string | null;
      }) => insert.run(instrument),
    );
  });

  insertMany(SEED_INSTRUMENTS);
}

export default function runMigrations(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS instruments (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      slug     TEXT NOT NULL UNIQUE,
      symbol   TEXT NOT NULL UNIQUE,
      name     TEXT,
      filepath TEXT
    );

    CREATE TABLE IF NOT EXISTS patterns (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      slug      TEXT NOT NULL UNIQUE,
      name      TEXT NOT NULL,
      sentences TEXT
    );
  `);

  seedPatterns(db);
  seedInstruments(db);
}
