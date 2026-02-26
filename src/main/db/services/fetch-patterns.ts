import { PatternDB } from '../models/pattern-db';
import patterns from '../mocks/patterns.json';

export default function fetchAllPatterns(): PatternDB[] {
  return patterns;
}
