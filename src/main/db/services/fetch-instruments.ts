import { InstrumentDB } from '../../../shared/models/instrument-db';
import { getAllInstruments } from '../repositories/instrument-repository';

export default function fetchAllInstruments(): InstrumentDB[] {
  return getAllInstruments();
}
