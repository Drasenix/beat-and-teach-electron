import detectPitch from './detect-pitch';

function generateSineWave(
  frequency: number,
  sampleRate: number,
  durationSeconds: number,
): Float32Array {
  const length = Math.floor(sampleRate * durationSeconds);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    samples[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate);
  }
  return samples;
}

function generateWhiteNoise(
  sampleRate: number,
  durationSeconds: number,
): Float32Array {
  const length = Math.floor(sampleRate * durationSeconds);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    samples[i] = Math.random() * 2 - 1;
  }
  return samples;
}

function generateSilence(
  sampleRate: number,
  durationSeconds: number,
): Float32Array {
  const length = Math.floor(sampleRate * durationSeconds);
  return new Float32Array(length);
}

function generateComplexTone(
  fundamental: number,
  sampleRate: number,
  durationSeconds: number,
): Float32Array {
  const length = Math.floor(sampleRate * durationSeconds);
  const samples = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    samples[i] =
      Math.sin((2 * Math.PI * fundamental * i) / sampleRate) +
      0.5 * Math.sin((2 * Math.PI * fundamental * 2 * i) / sampleRate) +
      0.3 * Math.sin((2 * Math.PI * fundamental * 3 * i) / sampleRate);
  }
  return samples;
}

describe('#detectPitch', () => {
  it('should detect a pure sine wave at 440 Hz', () => {
    const samples = generateSineWave(440, 44100, 0.5);
    const result = detectPitch(samples, 44100);
    expect(result).toBeCloseTo(440, -1);
  });

  it('should detect a pure sine wave at 220 Hz', () => {
    const samples = generateSineWave(220, 44100, 0.5);
    const result = detectPitch(samples, 44100);
    expect(result).toBeCloseTo(220, -1);
  });

  it('should detect a pure sine wave at 1000 Hz', () => {
    const samples = generateSineWave(1000, 44100, 0.5);
    const result = detectPitch(samples, 44100);
    expect(result).toBeCloseTo(1000, -1);
  });

  it('should return null for white noise', () => {
    const samples = generateWhiteNoise(44100, 0.5);
    const result = detectPitch(samples, 44100);
    expect(result).toBeNull();
  });

  it('should return null for silence', () => {
    const samples = generateSilence(44100, 0.5);
    const result = detectPitch(samples, 44100);
    expect(result).toBeNull();
  });

  it('should detect the fundamental in a complex tone with harmonics', () => {
    const samples = generateComplexTone(330, 44100, 0.5);
    const result = detectPitch(samples, 44100);
    expect(result).toBeCloseTo(330, -1);
  });

  it('should return null for very short signal', () => {
    const samples = generateSineWave(440, 44100, 0.001);
    const result = detectPitch(samples, 44100);
    expect(result).toBeNull();
  });
});
