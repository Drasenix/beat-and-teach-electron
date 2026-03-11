import { Pattern } from '../models/pattern-model';
import getAllPatterns, {
  createPattern,
  updatePatternAPI,
  deletePatternAPI,
} from '../services/pattern-service';

export default async function getPatterns(): Promise<Pattern[]> {
  return getAllPatterns();
}

export async function savePattern(
  pattern: Omit<Pattern, 'id' | 'slug'>,
): Promise<Pattern> {
  return createPattern(pattern);
}

export async function updatePattern(
  id: number,
  pattern: Partial<Omit<Pattern, 'id' | 'slug'>>,
): Promise<Pattern> {
  return updatePatternAPI(id, pattern);
}

export async function deletePattern(id: number): Promise<void> {
  return deletePatternAPI(id);
}
