import Database from 'better-sqlite3';
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
      sentences: JSON.stringify(['P (Ts P) Ts P K (Ts P) Ts P K Bw']),
    },
    {
      slug: 'funk',
      name: 'funk',
      sentences: JSON.stringify([
        'P Ts P Ts Kch Ts Ts Kch Ts Kch P Kch Kch P Ts Kch',
      ]),
    },
    {
      slug: 'funk-2',
      name: 'funk 2',
      sentences: JSON.stringify([
        'P (. Kch) . P . P Kch Ts (P Ts) (Ts Kch) (. Ts) (P Ts) (Ts Ts) (P P) (Kch .) Bw',
      ]),
    },
    {
      slug: 'reggae',
      name: 'reggae',
      sentences: JSON.stringify([
        'Tum (Ts K) (. K) . (Ts K) (. K) Tum (Ts K) (. K) . (Ts K) (. Tum)',
      ]),
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
      sentences: JSON.stringify(['P Ts K (Ts P) P P K Ts']),
    },
    {
      slug: '23',
      name: '2/3',
      sentences: JSON.stringify(['P Ts Pf', 'Eh (. Eh) .']),
    },
    {
      slug: '43',
      name: '4/3',
      sentences: JSON.stringify(['P Ts Pf Ts', 'Eh (. Eh . ) ( . . Eh) .']),
    },
    {
      slug: 'inward-drag',
      name: 'inward drag',
      sentences: JSON.stringify(['P A< F> S< A> F< Eh A< F> S< A> F<']),
    },
    {
      slug: 'drop-it-like-its-hot',
      name: 'drop it like its hot',
      sentences: JSON.stringify(['P (Lo P) (Pf Lo) P Lo (P Lo) Pf .']),
    },
    {
      slug: 'alexinho-drum-and-bass',
      name: 'alexinho drum and bass',
      sentences: JSON.stringify([
        'Bwr . Pf (Ts P) (K Kch) (Ts Kch) Pf (Ts P) (K Kch) (Ts Kch) Pf (Ts P) (K Kch) (Ts Kch) Pf Ts',
      ]),
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

  const SEED_INSTRUMENTS = [
    { slug: 'silence', symbol: '.', name: null, filepath: null },
    {
      slug: 'kickdrum',
      symbol: 'P',
      name: 'kickdrum',
      filepath: 'kickdrum.mp3',
    },
    { slug: 'hihat', symbol: 'Ts', name: 'hihat', filepath: 'hihat.mp3' },
    { slug: 'snare', symbol: 'Pf', name: 'snare', filepath: 'snare.mp3' },
    { slug: 'rimshot', symbol: 'K', name: 'rimshot', filepath: 'rimshot.mp3' },
    {
      slug: 'sonic-boom',
      symbol: 'W',
      name: 'sonic boom',
      filepath: 'sonic-boom.mp3',
    },
    {
      slug: 'air-A-inward',
      symbol: 'A<',
      name: 'air-A-inward',
      filepath: 'air-A-inward.mp3',
    },
    { slug: 'air-A', symbol: 'A>', name: 'air-A', filepath: 'air-A.mp3' },
    {
      slug: 'air-F-inward',
      symbol: 'F<',
      name: 'air-F-inward',
      filepath: 'air-F-inward.mp3',
    },
    { slug: 'air-F', symbol: 'F>', name: 'air-F', filepath: 'air-F.mp3' },
    {
      slug: 'air-S-inward',
      symbol: 'S<',
      name: 'air-S-inward',
      filepath: 'air-S-inward.mp3',
    },
    { slug: 'air-S', symbol: 'S>', name: 'air-S', filepath: 'air-S.mp3' },
    { slug: 'clock', symbol: 'Lo', name: 'clock', filepath: 'clock.mp3' },
    {
      slug: 'cough-snare',
      symbol: 'Eh',
      name: 'cough-snare',
      filepath: 'cough-snare.mp3',
    },
    {
      slug: 'kch-snare',
      symbol: 'Kch',
      name: 'kch-snare',
      filepath: 'kch-snare.mp3',
    },
    {
      slug: 'liproll-bass',
      symbol: 'Bwr',
      name: 'liproll-bass',
      filepath: 'liproll-bass.mp3',
    },
    { slug: 'liproll', symbol: 'Bw', name: 'liproll', filepath: 'liproll.mp3' },
    {
      slug: 'throat-bass',
      symbol: 'Rr',
      name: 'throat-bass',
      filepath: 'throat-bass.mp3',
    },
    {
      slug: 'tom-bass',
      symbol: 'Tum',
      name: 'tom-bass',
      filepath: 'tom-bass.mp3',
    },
    {
      slug: 'tongue-kick',
      symbol: 'p',
      name: 'tongue-kick',
      filepath: 'tongue-kick.mp3',
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

  // Rename legacy column 'sentence' (singular) → 'sentences' (plural)
  try {
    db.exec('ALTER TABLE patterns RENAME COLUMN sentence TO sentences;');
  } catch {
    // déjà renommée ou n'existait pas
  }

  // Convert legacy raw string sentences to JSON arrays
  const rowsToMigrate = db
    .prepare('SELECT id, sentences FROM patterns')
    .all() as { id: number; sentences: string }[];
  const migrateSentence = db.prepare(
    'UPDATE patterns SET sentences = @sentences WHERE id = @id',
  );
  rowsToMigrate.forEach(({ id, sentences }) => {
    try {
      JSON.parse(sentences);
    } catch {
      migrateSentence.run({ id, sentences: JSON.stringify([sentences]) });
    }
  });

  // Convert legacy absolute instrument filepaths to relative filenames
  const seedSlugs = new Set([
    'silence',
    'kickdrum',
    'hihat',
    'snare',
    'rimshot',
    'sonic-boom',
    'air-A-inward',
    'air-A',
    'air-F-inward',
    'air-F',
    'air-S-inward',
    'air-S',
    'clock',
    'cough-snare',
    'kch-snare',
    'liproll-bass',
    'liproll',
    'throat-bass',
    'tom-bass',
    'tongue-kick',
  ]);
  const instrumentsToFix = db
    .prepare('SELECT id, slug, filepath FROM instruments')
    .all() as { id: number; slug: string; filepath: string | null }[];
  const fixFilepath = db.prepare(
    'UPDATE instruments SET filepath = @filepath WHERE id = @id',
  );
  instrumentsToFix.forEach(({ id, slug, filepath }) => {
    if (filepath && seedSlugs.has(slug) && path.isAbsolute(filepath)) {
      fixFilepath.run({ id, filepath: path.basename(filepath) });
    }
  });

  seedPatterns(db);
  seedInstruments(db);
}
