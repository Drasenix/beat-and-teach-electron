import fs from 'fs';
import archiver from 'archiver';
import exportLibrary from '../services/export-library-service';
import { getPatternsByIds } from '../../db/repositories/pattern-repository';
import { getInstrumentsByIds } from '../../db/repositories/instrument-repository';

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn(() => '/fake/app/path'),
    isPackaged: false,
  },
}));

jest.mock('better-sqlite3');

jest.mock('fs');
jest.mock('archiver');
jest.mock('../../db/repositories/pattern-repository');
jest.mock('../../db/repositories/instrument-repository');

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedArchiver = archiver as jest.MockedFunction<typeof archiver>;
const mockedGetPatternsByIds = getPatternsByIds as jest.MockedFunction<
  typeof getPatternsByIds
>;
const mockedGetInstrumentsByIds = getInstrumentsByIds as jest.MockedFunction<
  typeof getInstrumentsByIds
>;

describe('#exportLibrary', () => {
  const mockArchive = {
    pipe: jest.fn(),
    append: jest.fn(),
    file: jest.fn(),
    finalize: jest.fn(),
    on: jest.fn(),
  };

  const mockWriteStream = {
    on: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedArchiver.mockReturnValue(mockArchive as unknown as archiver.Archiver);
    mockedFs.createWriteStream.mockReturnValue(
      mockWriteStream as unknown as fs.WriteStream,
    );
  });

  it('should export patterns and instruments into a ZIP archive', async () => {
    // Given
    mockedGetPatternsByIds.mockReturnValue([
      {
        id: 1,
        slug: 'rock-beat',
        name: 'Rock Beat',
        sentences: JSON.stringify(['kick snare', 'kick kick snare']),
        highlights: JSON.stringify([['kick'], ['snare']]),
      },
    ]);
    mockedGetInstrumentsByIds.mockReturnValue([
      {
        id: 10,
        slug: 'kick',
        symbol: 'K',
        name: 'Kick Drum',
        filepath: '/audio/kick.wav',
      },
    ]);
    mockedFs.existsSync.mockReturnValue(true);

    mockWriteStream.on.mockImplementation((event: string, cb: () => void) => {
      if (event === 'close') {
        cb();
      }
      return mockWriteStream;
    });

    // When
    const promise = exportLibrary([1], [10], '/output/test.beatpack');

    const result = await promise;

    // Then
    expect(result).toBe('/output/test.beatpack');
    expect(mockArchive.append).toHaveBeenCalled();
    expect(mockArchive.finalize).toHaveBeenCalled();
  });

  it('should skip instruments with missing filepath', async () => {
    // Given
    mockedGetPatternsByIds.mockReturnValue([]);
    mockedGetInstrumentsByIds.mockReturnValue([
      {
        id: 10,
        slug: 'kick',
        symbol: 'K',
        name: 'Kick Drum',
        filepath: null,
      },
    ]);

    mockWriteStream.on.mockImplementation((event: string, cb: () => void) => {
      if (event === 'close') cb();
      return mockWriteStream;
    });

    // When
    const promise = exportLibrary([], [10], '/output/test.beatpack');

    await promise;

    // Then
    expect(mockArchive.file).not.toHaveBeenCalled();
  });

  it('should skip instruments whose file does not exist on disk', async () => {
    // Given
    mockedGetPatternsByIds.mockReturnValue([]);
    mockedGetInstrumentsByIds.mockReturnValue([
      {
        id: 10,
        slug: 'kick',
        symbol: 'K',
        name: 'Kick Drum',
        filepath: '/audio/missing.wav',
      },
    ]);
    mockedFs.existsSync.mockReturnValue(false);

    mockWriteStream.on.mockImplementation((event: string, cb: () => void) => {
      if (event === 'close') cb();
      return mockWriteStream;
    });

    // When
    const promise = exportLibrary([], [10], '/output/test.beatpack');

    await promise;

    // Then
    expect(mockArchive.file).not.toHaveBeenCalled();
  });

  it('should reject when archive emits an error', async () => {
    // Given
    mockedGetPatternsByIds.mockReturnValue([]);
    mockedGetInstrumentsByIds.mockReturnValue([]);

    let errorCallback: ((err: Error) => void) | undefined;
    mockArchive.on.mockImplementation(
      (event: string, cb: (err: Error) => void) => {
        if (event === 'error') errorCallback = cb;
        return mockArchive;
      },
    );
    mockWriteStream.on.mockReturnValue(mockWriteStream);

    // When
    const promise = exportLibrary([], [], '/output/test.beatpack');

    // Trigger the error event
    errorCallback?.(new Error('Archive write failed'));

    // Then
    await expect(promise).rejects.toThrow('Archive write failed');
  });

  it('should export empty arrays when no IDs are provided', async () => {
    // Given
    mockedGetPatternsByIds.mockReturnValue([]);
    mockedGetInstrumentsByIds.mockReturnValue([]);

    mockWriteStream.on.mockImplementation((event: string, cb: () => void) => {
      if (event === 'close') cb();
      return mockWriteStream;
    });

    // When
    const promise = exportLibrary([], [], '/output/empty.beatpack');

    const result = await promise;

    // Then
    expect(result).toBe('/output/empty.beatpack');
    expect(mockArchive.append).toHaveBeenCalled();
  });
});
