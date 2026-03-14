import { PatternDB } from '../../../../shared/models/pattern-db';
import { adaptPatterns, adaptPattern } from '../adapters/pattern-adapter';
import { Pattern } from '../models/pattern-model';

export default async function getAllPatterns(): Promise<Pattern[]> {
  const patterns: PatternDB[] =
    await window.electron.ipcRenderer.invokeMessage('get-all-patterns');
  return adaptPatterns(patterns);
}

export async function createPatternAPI(
  pattern: Omit<Pattern, 'id' | 'slug'>,
): Promise<Pattern> {
  const patternDB: PatternDB = await window.electron.ipcRenderer.invokeMessage(
    'create-pattern',
    {
      ...pattern,
      sentences: JSON.stringify(pattern.sentences),
    },
  );
  return adaptPattern(patternDB);
}

export async function updatePatternAPI(
  id: number,
  pattern: Partial<Omit<Pattern, 'id' | 'slug'>>,
): Promise<Pattern> {
  const patternDB: PatternDB = await window.electron.ipcRenderer.invokeMessage(
    'update-pattern',
    id,
    {
      ...pattern,
      sentences: pattern.sentences
        ? JSON.stringify(pattern.sentences)
        : undefined,
    },
  );
  return adaptPattern(patternDB);
}

export async function deletePatternAPI(id: number): Promise<void> {
  await window.electron.ipcRenderer.invokeMessage('delete-pattern', id);
}
