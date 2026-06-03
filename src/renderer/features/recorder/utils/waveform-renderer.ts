export interface WaveformRenderOptions {
  canvas: HTMLCanvasElement;
  samples: Float32Array;
  trimStart: number;
  trimEnd: number;
  primaryColor?: string;
  surfaceColor?: string;
}

function downsample(
  samples: Float32Array,
  targetWidth: number,
): Float32Array[] {
  const chunkSize = Math.max(1, Math.floor(samples.length / targetWidth));
  const result: Float32Array[] = [];

  for (let i = 0; i < targetWidth; i += 1) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, samples.length);
    const chunk = samples.slice(start, end);
    result.push(chunk);
  }

  return result;
}

function getPeaks(chunk: Float32Array): { min: number; max: number } {
  let min = 0;
  let max = 0;

  for (let i = 0; i < chunk.length; i += 1) {
    const sample = chunk[i];
    if (sample < min) min = sample;
    if (sample > max) max = sample;
  }

  return { min, max };
}

export function renderWaveform(options: WaveformRenderOptions): void {
  const {
    canvas,
    samples,
    trimStart,
    trimEnd,
    primaryColor = '#679ff9',
    surfaceColor = '#111827',
  } = options;

  const ctx = canvas.getContext('2d');
  if (ctx === null) return;

  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  if (samples.length === 0) return;

  const chunks = downsample(samples, width);
  const centerY = height / 2;
  const maxAmplitude = height * 0.4;

  const trimStartPixel = Math.round(trimStart * width);
  const trimEndPixel = Math.round(trimEnd * width);

  ctx.fillStyle = surfaceColor;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = `${primaryColor}20`;
  ctx.fillRect(trimStartPixel, 0, trimEndPixel - trimStartPixel, height);

  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();

  chunks.forEach((chunk, i) => {
    const { min, max } = getPeaks(chunk);
    const x = i;

    ctx.moveTo(x, centerY - max * maxAmplitude);
    ctx.lineTo(x, centerY - min * maxAmplitude);
  });

  ctx.stroke();

  const cursorColor = primaryColor;
  ctx.strokeStyle = cursorColor;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(trimStartPixel, 0);
  ctx.lineTo(trimStartPixel, height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(trimEndPixel, 0);
  ctx.lineTo(trimEndPixel, height);
  ctx.stroke();
}

export function trimSamples(
  samples: Float32Array,
  trimStart: number,
  trimEnd: number,
): Float32Array {
  const startIndex = Math.round(trimStart * samples.length);
  const endIndex = Math.round(trimEnd * samples.length);
  return samples.slice(startIndex, endIndex);
}
