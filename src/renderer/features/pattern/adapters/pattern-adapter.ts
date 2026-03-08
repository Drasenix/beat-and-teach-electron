import { PatternDB } from '../../../../shared/models/pattern-db';
import { Pattern } from '../models/pattern-model';

export default function adaptPatterns(patterns: PatternDB[]): Pattern[] {
  return patterns.map(({ id, slug, name, sentence }) => ({
    id,
    slug,
    name,
    sentence,
  }));
}
