import { Pattern } from '../models/pattern-model';
import getAllPaterns from '../services/pattern-service';

export default async function getPatterns(): Promise<Pattern[]> {
  return getAllPaterns();
}
