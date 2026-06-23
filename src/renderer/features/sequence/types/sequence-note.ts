export type SequenceNote = {
  name: string | null;
  playbackRate: number;
  semitoneOffset?: number;
} | null;
export type SequenceNotes = SequenceNote | SequenceNote[];
