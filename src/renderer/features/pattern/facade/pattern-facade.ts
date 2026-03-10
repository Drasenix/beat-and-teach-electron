import { Pattern } from '../models/pattern-model';
import getAllPaterns, { createPattern } from '../services/pattern-service';

export default async function getPatterns(): Promise<Pattern[]> {
  return getAllPaterns();
}

export async function savePattern(
  pattern: Omit<Pattern, 'id' | 'slug'>,
): Promise<Pattern> {
  return createPattern(pattern);
}
