import { InstrumentDB } from '../models/instrument-db';
import instruments from '../mocks/instruments.json';

export default function fetchAllInstruments(): InstrumentDB[] {
  return instruments;
}
