import { InstrumentDTO } from '../../../../shared/models/instrument-dto';
import { Instrument } from '../models/instrument-model';

export default function adaptInstruments(
  instruments: InstrumentDTO[],
): Instrument[] {
  return instruments.map(({ id, slug, symbol, name, filepath }) => ({
    id,
    slug,
    symbol,
    name,
    filepath,
  }));
}

export function adaptInstrument(instrument: InstrumentDTO): Instrument {
  const { id, slug, symbol, name, filepath } = instrument;
  return { id, slug, symbol, name, filepath };
}
