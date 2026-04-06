import { PatternDTO } from '../../../../shared/models/pattern-dto';
import { Pattern } from '../models/pattern-model';

export function adaptPattern(pattern: PatternDTO): Pattern {
  const { id, slug, name, sentences, highlights } = pattern;
  return {
    id,
    slug,
    name,
    sentences: JSON.parse(sentences) as string[],
    highlights: JSON.parse(highlights) as (string | null)[][],
  };
}

export function adaptPatterns(patterns: PatternDTO[]): Pattern[] {
  return patterns.map(adaptPattern);
}
