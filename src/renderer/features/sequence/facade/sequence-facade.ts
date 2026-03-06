import {
  prepareFileNames as prepareFileNamesService,
  preparePattern as preparePatternService,
} from '../service/sequence-service';
import { SequenceNotes } from '../types/sequence-note';

export async function prepareFileNames(sentence: string): Promise<string[]> {
  return await prepareFileNamesService(sentence);
}

export async function preparePattern(
  sentence: string,
): Promise<SequenceNotes[]> {
  return await preparePatternService(sentence);
}
