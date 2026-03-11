import { InstrumentFormValues } from '../types/instrument-types';

export function validateInstrument(fields: InstrumentFormValues): string[] {
  const errors: string[] = [];
  if (!fields.symbol.trim()) errors.push('Le symbole est requis.');
  if (!fields.name?.trim()) errors.push('Le nom est requis.');
  if (!fields.filepath) errors.push('Le fichier audio est requis.');
  return errors;
}
