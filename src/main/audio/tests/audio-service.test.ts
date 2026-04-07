import fs from 'fs';
import path from 'path';
import {
  getAudioBufferFromFile,
  getAudioBuffersFromFiles,
} from '../services/audio-service';
import { InstrumentFilePath } from '../../../shared/types/instrument';

jest.mock('fs');

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('#getAudioBufferFromFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return an ArrayBuffer for a valid audio file', () => {
    // Given
    const fakeBuffer = Buffer.from([0x52, 0x49, 0x46, 0x46]);
    mockedFs.readFileSync.mockReturnValue(fakeBuffer);

    // When
    const result = getAudioBufferFromFile('/fake/audio/kick.wav');

    // Then
    expect(result.byteLength).toBe(4);
    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      path.resolve('/fake/audio/kick.wav'),
    );
  });

  it('should throw ENOENT when file does not exist', () => {
    // Given
    mockedFs.readFileSync.mockImplementation(() => {
      throw new Error('ENOENT: no such file or directory');
    });

    // When / Then
    expect(() => getAudioBufferFromFile('/nonexistent/file.wav')).toThrow(
      'ENOENT',
    );
  });

  it('should return an empty ArrayBuffer for an empty file', () => {
    // Given
    const emptyBuffer = Buffer.alloc(0);
    mockedFs.readFileSync.mockReturnValue(emptyBuffer);

    // When
    const result = getAudioBufferFromFile('/fake/empty.wav');

    // Then
    expect(result.byteLength).toBe(0);
  });

  it('should resolve relative paths correctly', () => {
    // Given
    const fakeBuffer = Buffer.from([0x01, 0x02]);
    mockedFs.readFileSync.mockReturnValue(fakeBuffer);

    // When
    getAudioBufferFromFile('./audio/kick.wav');

    // Then
    expect(mockedFs.readFileSync).toHaveBeenCalledWith(
      path.resolve('./audio/kick.wav'),
    );
  });
});

describe('#getAudioBuffersFromFiles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a map of name to ArrayBuffer for valid files', () => {
    // Given
    const kickBuffer = Buffer.from([0x01]);
    const snareBuffer = Buffer.from([0x02]);
    mockedFs.readFileSync
      .mockReturnValueOnce(kickBuffer)
      .mockReturnValueOnce(snareBuffer);

    const inputs: InstrumentFilePath[] = [
      { name: 'kick', filepath: '/audio/kick.wav' },
      { name: 'snare', filepath: '/audio/snare.wav' },
    ];

    // When
    const result = getAudioBuffersFromFiles(inputs);

    // Then
    expect(Object.keys(result)).toEqual(['kick', 'snare']);
    expect(result.kick.byteLength).toBe(1);
    expect(result.snare.byteLength).toBe(1);
  });

  it('should return an empty object for an empty array', () => {
    // Given
    const inputs: InstrumentFilePath[] = [];

    // When
    const result = getAudioBuffersFromFiles(inputs);

    // Then
    expect(result).toEqual({});
  });

  it('should skip entries with missing name', () => {
    // Given
    const inputs: InstrumentFilePath[] = [
      { name: undefined as never, filepath: '/audio/kick.wav' },
    ];

    // When
    const result = getAudioBuffersFromFiles(inputs);

    // Then
    expect(result).toEqual({});
    expect(mockedFs.readFileSync).not.toHaveBeenCalled();
  });

  it('should skip entries with missing filepath', () => {
    // Given
    const inputs: InstrumentFilePath[] = [
      { name: 'kick', filepath: undefined as never },
    ];

    // When
    const result = getAudioBuffersFromFiles(inputs);

    // Then
    expect(result).toEqual({});
    expect(mockedFs.readFileSync).not.toHaveBeenCalled();
  });

  it('should skip entries with both name and filepath missing', () => {
    // Given
    const inputs: InstrumentFilePath[] = [
      { name: undefined as never, filepath: undefined as never },
    ];

    // When
    const result = getAudioBuffersFromFiles(inputs);

    // Then
    expect(result).toEqual({});
    expect(mockedFs.readFileSync).not.toHaveBeenCalled();
  });

  it('should throw when one file in the list does not exist', () => {
    // Given
    mockedFs.readFileSync
      .mockReturnValueOnce(Buffer.from([0x01]))
      .mockImplementationOnce(() => {
        throw new Error('ENOENT: no such file or directory');
      });

    const inputs: InstrumentFilePath[] = [
      { name: 'kick', filepath: '/audio/kick.wav' },
      { name: 'snare', filepath: '/audio/missing.wav' },
    ];

    // When / Then
    expect(() => getAudioBuffersFromFiles(inputs)).toThrow('ENOENT');
  });
});
