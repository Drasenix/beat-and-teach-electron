const MAX_ANALYSIS_SAMPLES = 44100;
const MIN_CONFIDENCE = 0.5;

export default function detectPitch(
  samples: Float32Array,
  sampleRate: number,
): number | null {
  const analysisLength = Math.min(samples.length, MAX_ANALYSIS_SAMPLES);
  if (analysisLength < sampleRate * 0.02) return null;

  const minLag = Math.floor(sampleRate / 2000);
  const maxLag = Math.floor(sampleRate / 50);

  if (minLag >= maxLag) return null;

  let totalEnergy = 0;
  for (let i = 0; i < analysisLength; i += 1) {
    totalEnergy += samples[i] * samples[i];
  }

  if (totalEnergy === 0) return null;

  let maxCorrelation = -Infinity;
  let bestLag = 0;

  for (let lag = minLag; lag < maxLag; lag += 1) {
    let correlation = 0;
    const limit = analysisLength - lag;
    for (let i = 0; i < limit; i += 1) {
      correlation += samples[i] * samples[i + lag];
    }
    if (correlation > maxCorrelation) {
      maxCorrelation = correlation;
      bestLag = lag;
    }
  }

  const confidence = maxCorrelation / totalEnergy;
  if (confidence < MIN_CONFIDENCE) return null;

  return sampleRate / bestLag;
}
