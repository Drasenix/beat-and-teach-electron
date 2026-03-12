import { PatternFormValues } from '../types/pattern-types';

export default function validatePattern(fields: PatternFormValues): string[] {
  const errors: string[] = [];
  if (!fields.name.trim()) errors.push('Le nom est requis.');
  if (!fields.sentence.trim()) errors.push('La phrase est requise.');
  return errors;
}
