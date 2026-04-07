import fs from 'fs';
import AdmZip, { IZipEntry } from 'adm-zip';
import {
  parseLibraryFile,
  importLibrary,
} from '../services/import-library-service';
import {
  createPattern,
  deletePattern,
} from '../../db/repositories/pattern-repository';
import {
  createInstrument,
  deleteInstrument,
} from '../../db/repositories/instrument-repository';
import fetchAllPatterns from '../../db/services/fetch-patterns';
import fetchAllInstruments from '../../db/services/fetch-instruments';

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn(() => '/fake/app/path'),
    isPackaged: false,
  },
}));

jest.mock('better-sqlite3');

jest.mock('fs');
jest.mock('adm-zip');
jest.mock('../../db/repositories/pattern-repository');
jest.mock('../../db/repositories/instrument-repository');
jest.mock('../../db/services/fetch-patterns');
jest.mock('../../db/services/fetch-instruments');

const mockedFs = fs as jest.Mocked<typeof fs>;
const MockedAdmZip = AdmZip as jest.MockedClass<typeof AdmZip>;
const mockedCreatePattern = createPattern as jest.MockedFunction<
  typeof createPattern
>;
const mockedDeletePattern = deletePattern as jest.MockedFunction<
  typeof deletePattern
>;
const mockedCreateInstrument = createInstrument as jest.MockedFunction<
  typeof createInstrument
>;
const mockedDeleteInstrument = deleteInstrument as jest.MockedFunction<
  typeof deleteInstrument
>;
const mockedFetchAllPatterns = fetchAllPatterns as jest.MockedFunction<
  typeof fetchAllPatterns
>;
const mockedFetchAllInstruments = fetchAllInstruments as jest.MockedFunction<
  typeof fetchAllInstruments
>;

describe('#parseLibraryFile', () => {
  it('should return a valid manifest when manifest.json exists', () => {
    // Given
    const mockZipEntry: IZipEntry = {
      getData: jest.fn(() =>
        Buffer.from(
          JSON.stringify({
            version: 1,
            exportDate: '2026-01-01T00:00:00.000Z',
            patterns: [],
            instruments: [],
          }),
        ),
      ),
    } as unknown as IZipEntry;
    // Given
    const mockZip = {
      getEntry: jest.fn(() => mockZipEntry),
    };
    MockedAdmZip.mockImplementation(() => mockZip as unknown as AdmZip);

    // When
    const result = parseLibraryFile('/path/to/test.beatpack');

    // Then
    expect(result.version).toBe(1);
    expect(result.patterns).toEqual([]);
    expect(result.instruments).toEqual([]);
  });

  it('should throw when manifest.json is missing', () => {
    // Given
    const mockZip = {
      getEntry: jest.fn(() => null),
    };
    MockedAdmZip.mockImplementation(() => mockZip as unknown as AdmZip);

    // When / Then
    expect(() => parseLibraryFile('/path/to/invalid.beatpack')).toThrow(
      'Fichier manifest.json introuvable',
    );
  });

  it('should throw when manifest version is not 1', () => {
    // Given
    const invalidManifest = JSON.stringify({
      version: 2,
      exportDate: '2026-01-01T00:00:00.000Z',
      patterns: [],
      instruments: [],
    });
    const mockZipEntry: IZipEntry = {
      getData: jest.fn(() => Buffer.from(invalidManifest)),
    } as unknown as IZipEntry;
    const mockZip = {
      getEntry: jest.fn(() => mockZipEntry),
    };
    MockedAdmZip.mockImplementation(() => mockZip as unknown as AdmZip);

    // When / Then
    expect(() => parseLibraryFile('/path/to/old.beatpack')).toThrow(
      'Version de manifest non supportée',
    );
  });
});

describe('#importLibrary', () => {
  const mockManifest = {
    version: 1,
    exportDate: '2026-01-01T00:00:00.000Z',
    patterns: [
      {
        slug: 'rock-beat',
        name: 'Rock Beat',
        sentences: ['kick snare', 'kick kick snare'],
        highlights: [['kick'], ['snare']],
      },
    ],
    instruments: [
      {
        slug: 'kick',
        symbol: 'K',
        name: 'Kick Drum',
        audioFile: 'audio/kick.wav',
      },
    ],
  };

  function createMockZip() {
    return {
      getEntry: jest.fn((entryName: string): IZipEntry | null => {
        if (entryName === 'manifest.json') {
          return {
            getData: jest.fn(() => Buffer.from(JSON.stringify(mockManifest))),
          } as unknown as IZipEntry;
        }
        if (entryName === 'audio/kick.wav') {
          return {
            getData: jest.fn(() => Buffer.from([0x01, 0x02, 0x03])),
          } as unknown as IZipEntry;
        }
        return null;
      }),
    };
  }

  beforeEach(() => {
    jest.clearAllMocks();
    mockedFs.existsSync.mockReturnValue(true);
    MockedAdmZip.mockImplementation(() => createMockZip() as unknown as AdmZip);
    mockedFetchAllPatterns.mockReturnValue([]);
    mockedFetchAllInstruments.mockReturnValue([]);
    mockedCreatePattern.mockReturnValue({} as any);
    mockedCreateInstrument.mockReturnValue({} as any);
  });

  it('should import patterns and instruments with overwrite resolution', async () => {
    // Given
    const resolutions = [
      {
        type: 'pattern' as const,
        slug: 'rock-beat',
        action: 'overwrite' as const,
      },
      {
        type: 'instrument' as const,
        slug: 'kick',
        action: 'overwrite' as const,
      },
    ];

    // When
    const result = await importLibrary(
      '/path/to/test.beatpack',
      resolutions,
      '/audio/dest',
    );

    // Then
    expect(result.importedPatterns).toBe(1);
    expect(result.importedInstruments).toBe(1);
    expect(result.skippedPatterns).toBe(0);
    expect(result.skippedInstruments).toBe(0);
    expect(result.errors).toEqual([]);
    expect(mockedCreatePattern).toHaveBeenCalled();
    expect(mockedCreateInstrument).toHaveBeenCalled();
  });

  it('should skip items when resolution action is skip', async () => {
    // Given
    const resolutions = [
      { type: 'pattern' as const, slug: 'rock-beat', action: 'skip' as const },
      { type: 'instrument' as const, slug: 'kick', action: 'skip' as const },
    ];

    // When
    const result = await importLibrary(
      '/path/to/test.beatpack',
      resolutions,
      '/audio/dest',
    );

    // Then
    expect(result.importedPatterns).toBe(0);
    expect(result.importedInstruments).toBe(0);
    expect(result.skippedPatterns).toBe(1);
    expect(result.skippedInstruments).toBe(1);
  });

  it('should skip items when no resolution is provided', async () => {
    // Given
    const resolutions: {
      type: 'pattern' | 'instrument';
      slug: string;
      action: 'overwrite' | 'skip' | 'rename';
      newName?: string;
    }[] = [];

    // When
    const result = await importLibrary(
      '/path/to/test.beatpack',
      resolutions,
      '/audio/dest',
    );

    // Then
    expect(result.skippedPatterns).toBe(1);
    expect(result.skippedInstruments).toBe(1);
  });

  it('should rename pattern when resolution action is rename', async () => {
    // Given
    const resolutions = [
      {
        type: 'pattern' as const,
        slug: 'rock-beat',
        action: 'rename' as const,
        newName: 'My Custom Beat',
      },
      {
        type: 'instrument' as const,
        slug: 'kick',
        action: 'overwrite' as const,
      },
    ];

    // When
    await importLibrary('/path/to/test.beatpack', resolutions, '/audio/dest');

    // Then
    expect(mockedCreatePattern).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'My Custom Beat',
      }),
    );
  });

  it('should delete existing pattern before creating when slug conflicts', async () => {
    // Given
    mockedFetchAllPatterns.mockReturnValue([
      {
        id: 99,
        slug: 'rock-beat',
        name: 'Old Rock Beat',
        sentences: JSON.stringify(['old']),
        highlights: JSON.stringify([]),
      },
    ]);
    const resolutions = [
      {
        type: 'pattern' as const,
        slug: 'rock-beat',
        action: 'overwrite' as const,
      },
      {
        type: 'instrument' as const,
        slug: 'kick',
        action: 'overwrite' as const,
      },
    ];

    // When
    await importLibrary('/path/to/test.beatpack', resolutions, '/audio/dest');

    // Then
    expect(mockedDeletePattern).toHaveBeenCalledWith(99);
    expect(mockedCreatePattern).toHaveBeenCalled();
  });

  it('should delete existing instrument by slug and symbol before creating', async () => {
    // Given
    mockedFetchAllInstruments.mockReturnValue([
      {
        id: 88,
        slug: 'kick',
        symbol: 'K',
        name: 'Old Kick',
        filepath: '/audio/old-kick.wav',
      },
    ]);
    const resolutions = [
      {
        type: 'pattern' as const,
        slug: 'rock-beat',
        action: 'overwrite' as const,
      },
      {
        type: 'instrument' as const,
        slug: 'kick',
        action: 'overwrite' as const,
      },
    ];

    // When
    await importLibrary('/path/to/test.beatpack', resolutions, '/audio/dest');

    // Then
    expect(mockedDeleteInstrument).toHaveBeenCalledWith(88);
    expect(mockedCreateInstrument).toHaveBeenCalled();
  });

  it('should create audio destination directory if it does not exist', async () => {
    // Given
    mockedFs.existsSync.mockReturnValue(false);
    const resolutions = [
      {
        type: 'pattern' as const,
        slug: 'rock-beat',
        action: 'overwrite' as const,
      },
      {
        type: 'instrument' as const,
        slug: 'kick',
        action: 'overwrite' as const,
      },
    ];

    // When
    await importLibrary(
      '/path/to/test.beatpack',
      resolutions,
      '/audio/new-dest',
    );

    // Then
    expect(mockedFs.mkdirSync).toHaveBeenCalledWith('/audio/new-dest', {
      recursive: true,
    });
  });

  it('should write audio file from ZIP to destination', async () => {
    // Given
    const resolutions = [
      {
        type: 'pattern' as const,
        slug: 'rock-beat',
        action: 'overwrite' as const,
      },
      {
        type: 'instrument' as const,
        slug: 'kick',
        action: 'overwrite' as const,
      },
    ];

    // When
    await importLibrary('/path/to/test.beatpack', resolutions, '/audio/dest');

    // Then
    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('kick.wav'),
      expect.any(Buffer),
    );
  });

  it('should increment skipped count when pattern creation fails', async () => {
    // Given
    mockedCreatePattern.mockImplementation(() => {
      throw new Error('DB constraint violation');
    });
    const resolutions = [
      {
        type: 'pattern' as const,
        slug: 'rock-beat',
        action: 'overwrite' as const,
      },
      {
        type: 'instrument' as const,
        slug: 'kick',
        action: 'overwrite' as const,
      },
    ];

    // When
    const result = await importLibrary(
      '/path/to/test.beatpack',
      resolutions,
      '/audio/dest',
    );

    // Then
    expect(result.importedPatterns).toBe(0);
    expect(result.skippedPatterns).toBe(1);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toContain('Rock Beat');
  });

  it('should increment skipped count when instrument creation fails', async () => {
    // Given
    mockedCreateInstrument.mockImplementation(() => {
      throw new Error('DB constraint violation');
    });
    const resolutions = [
      {
        type: 'pattern' as const,
        slug: 'rock-beat',
        action: 'overwrite' as const,
      },
      {
        type: 'instrument' as const,
        slug: 'kick',
        action: 'overwrite' as const,
      },
    ];

    // When
    const result = await importLibrary(
      '/path/to/test.beatpack',
      resolutions,
      '/audio/dest',
    );

    // Then
    expect(result.importedInstruments).toBe(0);
    expect(result.skippedInstruments).toBe(1);
    expect(result.errors.length).toBe(1);
    expect(result.errors[0]).toContain('Kick Drum');
  });
});
