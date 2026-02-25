import { IPattern } from '../../../../main/services/db/models/pattern-interface';
import fetchAllPatterns from '../../../../main/services/db/services/patterns';
import adaptPatterns from './pattern-adapter';
import Pattern from './pattern-model';

export default async function getAllPaterns(): Promise<Pattern[]> {
  const patterns: IPattern[] = await fetchAllPatterns();
  return adaptPatterns(patterns);
}
