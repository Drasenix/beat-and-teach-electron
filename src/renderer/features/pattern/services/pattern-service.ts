import { IPattern } from '../../../../main/services/db/models/pattern-interface';
import adaptPatterns from '../models/pattern-adapter';
import { Pattern } from '../models/pattern-model';

export default async function getAllPaterns(): Promise<Pattern[]> {
  const patterns: IPattern[] =
    await window.electron.ipcRenderer.getAllPatterns();
  return adaptPatterns(patterns);
}
