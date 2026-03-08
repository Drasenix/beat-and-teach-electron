import { InstrumentFile } from '../types/instrument-file';

export interface Instrument {
  id: number;
  slug: string;
  symbol: string;
  filepath: InstrumentFile;
  name: InstrumentFile;
}
