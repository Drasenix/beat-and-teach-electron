import { PatternDTO } from '../../../shared/models/pattern-dto';
import { getAllPatterns } from '../repositories/pattern-repository';

export default function fetchAllPatterns(): PatternDTO[] {
  return getAllPatterns();
}
