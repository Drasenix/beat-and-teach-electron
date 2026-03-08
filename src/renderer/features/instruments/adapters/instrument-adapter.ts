import { InstrumentDB } from '../../../../shared/models/instrument-db';
import { Instrument } from '../models/instrument-model';

export default function adaptInstruments(instruments: InstrumentDB[]): Instrument[] {
  return instruments.map(({ id, slug, symbol, name, filepath }) => ({
    id,
    slug,
    symbol,
    name,
    filepath,
  }));
}
