import noteNameToFrequency from './note-name-to-frequency';

export type ParsedToken = {
  symbol: string;
  frequency?: number;
};

export function parseToken(raw: string): ParsedToken {
  const atIndex = raw.indexOf('@');
  if (atIndex <= 0) return { symbol: raw };

  const symbol = raw.substring(0, atIndex);
  const value = raw.substring(atIndex + 1);

  const hz = parseFloat(value);
  if (!Number.isNaN(hz) && hz > 0) return { symbol, frequency: hz };

  const noteFreq = noteNameToFrequency(value);
  if (noteFreq !== null && noteFreq > 0) return { symbol, frequency: noteFreq };

  return { symbol };
}
