import { InstrumentDB } from '../../../../main/services/db/models/instrument-db';
import { Instrument } from './instrument-model';

export default function adaptInstruments(
  instruments: InstrumentDB[],
): Instrument[] {
  return instruments.map((instrument) => {
    return {
      id: instrument.id,
      symbol: instrument.symbol,
      filename: instrument.filename,
    };
  });
}
