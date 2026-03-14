import { PatternFormValues } from '../types/pattern-types';

export default function validatePattern(fields: PatternFormValues): string[] {
  const errors: string[] = [];
  if (!fields.name.trim()) errors.push('Le nom est requis.');
  if (fields.sentences.length === 0)
    errors.push('Au moins une phrase est requise.');
  fields.sentences.forEach((sentence, index) => {
    if (!sentence.trim()) errors.push(`La phrase ${index + 1} est requise.`);
  });
  return errors;
}
