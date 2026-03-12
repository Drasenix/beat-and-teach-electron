import { Instrument } from '../models/instrument-model';

export type InstrumentFormValues = Omit<Instrument, 'id' | 'slug'>;
