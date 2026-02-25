import { IPattern } from '../../../main/services/db/models/pattern-interface';
import adaptPatterns from './pattern-adapter';
import Pattern from './pattern-model';

export default async function getAllPaterns(): Promise<Pattern[]> {
  const patterns: IPattern[] =
    await window.electron.ipcRenderer.getAllPatterns();
  return adaptPatterns(patterns);
}
