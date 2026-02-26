import { PatternDB } from '../../../../main/services/db/models/pattern-db';
import adaptPatterns from '../models/pattern-adapter';
import { Pattern } from '../models/pattern-model';

export default async function getAllPaterns(): Promise<Pattern[]> {
  const patterns: PatternDB[] =
    await window.electron.ipcRenderer.getAllPatterns();
  return adaptPatterns(patterns);
}
