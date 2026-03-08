import { PatternDB } from '../../../shared/models/pattern-db';
import { getAllPatterns } from '../repositories/pattern-repository';

export default function fetchAllPatterns(): PatternDB[] {
  return getAllPatterns();
}
