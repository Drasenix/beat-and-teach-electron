import { PatternDB } from '../../../../shared/models/pattern-db';
import { Pattern } from '../models/pattern-model';

export function adaptPattern(pattern: PatternDB): Pattern {
  const { id, slug, name, sentence } = pattern;
  return { id, slug, name, sentence };
}

export function adaptPatterns(patterns: PatternDB[]): Pattern[] {
  return patterns.map(adaptPattern);
}
