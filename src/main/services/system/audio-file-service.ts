import fs from 'fs';
import path from 'path';

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

export function getAudioBuffersFromFiles(
  filenames: string[],
): (ArrayBuffer | SharedArrayBuffer)[] {
  return filenames.map((filename) => {
    return getAudioBufferFromFile(filename);
  });
}
