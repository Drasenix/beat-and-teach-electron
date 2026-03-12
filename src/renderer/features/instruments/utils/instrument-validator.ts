import { InstrumentFormValues } from '../types/instrument-types';

export default function validateInstrument(
  instrument: InstrumentFormValues,
): string[] {
  const errors: string[] = [];
  if (!instrument.symbol.trim()) errors.push('Le symbole est requis.');
  if (!instrument.name?.trim()) errors.push('Le nom est requis.');
  if (!instrument.filepath) errors.push('Le fichier audio est requis.');
  return errors;
}
