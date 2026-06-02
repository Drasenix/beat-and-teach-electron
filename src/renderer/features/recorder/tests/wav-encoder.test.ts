import encodeWav from '../utils/wav-encoder';

function readString(view: DataView, offset: number, length: number): string {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += String.fromCharCode(view.getUint8(offset + i));
  }
  return result;
}

describe('encodeWav', () => {
  it('should produce a valid WAV header for empty samples', () => {
    const samples = new Float32Array(0);
    const buffer = encodeWav(samples, 44100);
    const view = new DataView(buffer);

    expect(buffer.byteLength).toBe(44);
    expect(readString(view, 0, 4)).toBe('RIFF');
    expect(readString(view, 8, 4)).toBe('WAVE');
    expect(readString(view, 12, 4)).toBe('fmt ');
    expect(readString(view, 36, 4)).toBe('data');
    expect(view.getUint32(40, true)).toBe(0);
  });

  it('should encode with the given sample rate', () => {
    const samples = new Float32Array([0, 0, 0]);
    const buffer44100 = encodeWav(samples, 44100);
    const buffer22050 = encodeWav(samples, 22050);
    const view44100 = new DataView(buffer44100);
    const view22050 = new DataView(buffer22050);

    expect(view44100.getUint32(24, true)).toBe(44100);
    expect(view22050.getUint32(24, true)).toBe(22050);
  });

  it('should encode a single channel 16-bit PCM', () => {
    const samples = new Float32Array([0, 0, 0]);
    const buffer = encodeWav(samples, 44100);
    const view = new DataView(buffer);

    expect(view.getUint16(22, true)).toBe(1);
    expect(view.getUint16(34, true)).toBe(16);
  });

  it('should encode silent samples as zero data', () => {
    const samples = new Float32Array(4);
    const buffer = encodeWav(samples, 44100);
    const view = new DataView(buffer);

    for (let i = 0; i < 4; i += 1) {
      expect(view.getInt16(44 + i * 2, true)).toBe(0);
    }
  });

  it('should encode a full-scale positive sample as 32767', () => {
    const samples = new Float32Array([1.0]);
    const buffer = encodeWav(samples, 44100);
    const view = new DataView(buffer);

    expect(view.getInt16(44, true)).toBe(0x7fff);
  });

  it('should encode a full-scale negative sample as -32768', () => {
    const samples = new Float32Array([-1.0]);
    const buffer = encodeWav(samples, 44100);
    const view = new DataView(buffer);

    expect(view.getInt16(44, true)).toBe(-0x8000);
  });

  it('should clamp values above 1.0', () => {
    const samples = new Float32Array([1.5]);
    const buffer = encodeWav(samples, 44100);
    const view = new DataView(buffer);

    expect(view.getInt16(44, true)).toBe(0x7fff);
  });

  it('should clamp values below -1.0', () => {
    const samples = new Float32Array([-1.5]);
    const buffer = encodeWav(samples, 44100);
    const view = new DataView(buffer);

    expect(view.getInt16(44, true)).toBe(-0x8000);
  });

  it('should compute correct total buffer size', () => {
    const samples = new Float32Array(100);
    const buffer = encodeWav(samples, 44100);

    expect(buffer.byteLength).toBe(44 + 100 * 2);
  });

  it('should encode a known waveform correctly', () => {
    const samples = new Float32Array([0.5, -0.5, 0.25, -0.25]);
    const buffer = encodeWav(samples, 44100);
    const view = new DataView(buffer);

    expect(view.getInt16(44, true)).toBe(0x3fff);
    expect(view.getInt16(46, true)).toBe(-0x4000);
    expect(view.getInt16(48, true)).toBe(0x1fff);
    expect(view.getInt16(50, true)).toBe(-0x2000);
  });
});
