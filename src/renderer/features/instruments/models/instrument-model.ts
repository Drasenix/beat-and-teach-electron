import { InstrumentFile } from '../types/instrument-file';

export interface Instrument {
  id: string;
  symbol: string;
  filename: InstrumentFile;
  name: InstrumentFile;
}
