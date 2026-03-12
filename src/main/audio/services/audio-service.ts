import fs from 'fs';
import path from 'path';
import AudioFileBuffer from '../../../shared/types/audio-file-buffer';
import { InstrumentFilePath } from '../../../shared/types/instrument';

export function getAudioBufferFromFile(
  filepath: string,
): ArrayBuffer | SharedArrayBuffer {
  const uri: string = path.resolve(filepath);
  const fileData: Buffer<ArrayBufferLike> = fs.readFileSync(uri);
  return fileData.buffer.slice(
    fileData.byteOffset,
    fileData.byteOffset + fileData.byteLength,
  );
}

export function getAudioBuffersFromFiles(
  filepaths: InstrumentFilePath[],
): AudioFileBuffer {
  return filepaths.reduce((result, { name, filepath }) => {
    if (!name || !filepath) return result;
    return {
      ...result,
      [name]: getAudioBufferFromFile(filepath),
    };
  }, {});
}
