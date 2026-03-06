import { PatternDB } from '../../../../main/db/models/pattern-db';
import { Pattern } from '../models/pattern-model';

export default function adaptPatterns(patterns: PatternDB[]): Pattern[] {
  return patterns.map(({ id, name, sentence }) => ({
    id,
    name,
    sentence,
  }));
}
