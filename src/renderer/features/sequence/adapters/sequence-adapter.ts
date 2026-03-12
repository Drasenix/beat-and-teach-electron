import { InstrumentName } from '../../../../shared/types/instrument';
import { SequenceNote } from '../types/sequence-note';

export function toSequenceNote(name: InstrumentName): SequenceNote {
  return name;
}
