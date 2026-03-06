import fs from 'fs';
import path from 'path';
import AudioFileBuffer from '../../../shared/types/audio-file-buffer';

export function getAudioBufferFromFile(
  filename: string,
): ArrayBuffer | SharedArrayBuffer {
  const uri: string = path.resolve(__dirname, `../../assets/audio/${filename}`);
  const fileData: Buffer<ArrayBufferLike> = fs.readFileSync(uri);
  return fileData.buffer.slice(
    fileData.byteOffset,
    fileData.byteOffset + fileData.byteLength,
  );
}

export function getAudioBuffersFromFiles(filenames: string[]): AudioFileBuffer {
  return filenames.reduce((result, filename) => {
    const audioBuffer: AudioFileBuffer = {
      [filename.split('.')[0]]: getAudioBufferFromFile(filename),
    };
    return { ...result, ...audioBuffer };
  }, {});
}
