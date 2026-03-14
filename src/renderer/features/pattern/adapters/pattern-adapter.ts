import { PatternDB } from '../../../../shared/models/pattern-db';
import { Pattern } from '../models/pattern-model';

export function adaptPattern(pattern: PatternDB): Pattern {
  const { id, slug, name, sentences } = pattern;
  return {
    id,
    slug,
    name,
    sentences: JSON.parse(sentences) as string[],
  };
}

export function adaptPatterns(patterns: PatternDB[]): Pattern[] {
  return patterns.map(adaptPattern);
}
