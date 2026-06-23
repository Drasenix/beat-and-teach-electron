const NOTE_OFFSETS: Record<string, number> = {
  C: 0,
  'C#': 1,
  Db: 1,
  D: 2,
  'D#': 3,
  Eb: 3,
  E: 4,
  Fb: 4,
  F: 5,
  'F#': 6,
  Gb: 6,
  G: 7,
  'G#': 8,
  Ab: 8,
  A: 9,
  'A#': 10,
  Bb: 10,
  B: 11,
  Cb: 11,
};

const NOTE_REGEX = /^([A-Ga-g])([#b]?)(\d+)$/;

export default function noteNameToFrequency(noteName: string): number | null {
  const match = NOTE_REGEX.exec(noteName);
  if (!match) return null;

  const note = match[1].toUpperCase() + match[2];
  const octave = parseInt(match[3], 10);

  if (!(note in NOTE_OFFSETS)) return null;

  const semitone = NOTE_OFFSETS[note];
  const midiNote = (octave + 1) * 12 + semitone;
  return 440 * 2 ** ((midiNote - 69) / 12);
}
