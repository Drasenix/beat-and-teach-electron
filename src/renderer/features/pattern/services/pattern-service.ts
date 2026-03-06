import { PatternDB } from '../../../../main/db/models/pattern-db';
import adaptPatterns from '../adapters/pattern-adapter';
import { Pattern } from '../models/pattern-model';

export default async function getAllPaterns(): Promise<Pattern[]> {
  const patterns: PatternDB[] =
    await window.electron.ipcRenderer.invokeMessage('get-all-patterns');
  return adaptPatterns(patterns);
}
