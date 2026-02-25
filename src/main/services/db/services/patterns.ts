import { IPattern } from '../models/pattern-interface';
import patterns from '../mocks/patterns.json';

export default function fetchAllPatterns(): IPattern[] {
  return patterns;
}
