import { IPattern } from '../../../main/services/db/models/pattern-interface';
import Pattern from './pattern-model';

export default function adaptPatterns(patterns: IPattern[]): Pattern[] {
  return patterns.map((pattern) => {
    return {
      id: pattern.id,
      name: pattern.name,
      sentence: pattern.sentence,
    };
  });
}
