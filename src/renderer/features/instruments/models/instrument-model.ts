import { InstrumentFile } from '../types/instrument-types';

export interface Instrument {
  id: number;
  slug: string;
  symbol: string;
  filepath: InstrumentFile;
  name: InstrumentFile;
}
