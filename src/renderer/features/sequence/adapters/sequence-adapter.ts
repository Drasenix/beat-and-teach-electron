import { InstrumentName } from '../../../../shared/types/instrument';
import { SequenceNote } from '../types/sequence-note';

export default function toSequenceNote(
  name: InstrumentName,
  playbackRate?: number,
  semitoneOffset?: number,
): SequenceNote {
  if (name === null) return null;
  const note: SequenceNote = { name, playbackRate: playbackRate ?? 1 };
  if (semitoneOffset !== undefined) {
    note.semitoneOffset = semitoneOffset;
  }
  return note;
}
