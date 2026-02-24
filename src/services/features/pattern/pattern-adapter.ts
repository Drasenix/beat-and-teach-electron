import { IPattern } from '../../api/models/pattern-interface';
import Pattern from './pattern-model';

export default function adaptPatterns(patterns: IPattern[]): Pattern[] {
  return patterns.map(
    (pattern) => new Pattern(pattern.id, pattern.name, pattern.sentence),
  );
}
