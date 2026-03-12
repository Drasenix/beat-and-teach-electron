import { InstrumentName } from '../../../../shared/types/instrument';
import { SequenceNote } from '../types/sequence-note';

export default function toSequenceNote(name: InstrumentName): SequenceNote {
  return name;
}
