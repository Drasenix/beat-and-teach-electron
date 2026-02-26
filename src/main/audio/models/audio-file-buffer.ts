export default interface AudioFileBuffer {
  [filename: string]: ArrayBuffer | SharedArrayBuffer;
}
