import { InstrumentDTO } from '../../../shared/models/instrument-dto';
import { getAllInstruments } from '../repositories/instrument-repository';

export default function fetchAllInstruments(): InstrumentDTO[] {
  return getAllInstruments();
}
