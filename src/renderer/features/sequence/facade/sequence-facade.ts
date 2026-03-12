import { InstrumentFilePath } from '../../../../shared/types/instrument';
import {
  prepareFilePaths as prepareFilePathsService,
  preparePattern as preparePatternService,
} from '../service/sequence-service';
import { SequenceNotes } from '../types/sequence-note';

export async function prepareFilePaths(
  sentence: string,
): Promise<InstrumentFilePath[]> {
  return prepareFilePathsService(sentence);
}

export async function preparePattern(
  sentence: string,
): Promise<SequenceNotes[]> {
  return preparePatternService(sentence);
}
