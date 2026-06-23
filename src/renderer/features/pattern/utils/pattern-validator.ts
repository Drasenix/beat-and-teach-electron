import { parseToken } from '../../../utils/token-parser';
import { PatternFormValues } from '../types/pattern-types';

type ValidatePatternFields = Pick<PatternFormValues, 'name' | 'sentences'>;

export default function validatePattern(
  fields: ValidatePatternFields,
): string[] {
  const errors: string[] = [];
  if (!fields.name.trim()) errors.push('Le nom est requis.');
  if (fields.sentences.length === 0)
    errors.push('Au moins une phrase est requise.');
  fields.sentences.forEach((sentence, index) => {
    if (!sentence.trim()) errors.push(`La phrase ${index + 1} est requise.`);
  });
  return errors;
}

export function areAllSymbolsValid(
  sentences: string[],
  validSymbols: string[],
): boolean {
  const symbols = sentences
    .join(' ')
    .replace(/[()]/g, '')
    .split(/\s+/)
    .filter((s) => s.length > 0);
  if (symbols.length === 0) return true;
  return symbols.every((s) => {
    const cleaned = parseToken(s).symbol;
    return cleaned === '.' || validSymbols.includes(cleaned);
  });
}
