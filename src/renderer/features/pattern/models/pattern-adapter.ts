import { PatternDB } from '../../../../main/db/models/pattern-db';
import { Pattern } from './pattern-model';

export default function adaptPatterns(patterns: PatternDB[]): Pattern[] {
  return patterns.map((pattern) => {
    return {
      id: pattern.id,
      name: pattern.name,
      sentence: pattern.sentence,
    };
  });
}
