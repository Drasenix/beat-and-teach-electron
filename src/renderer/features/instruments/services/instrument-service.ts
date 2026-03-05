import { InstrumentDB } from '../../../../main/db/models/instrument-db';
import adaptInstruments from '../models/instrument-adapter';
import { Instrument } from '../models/instrument-model';
import { InstrumentController } from '../controller/instrument-controller';
import { SequenceNotes } from '../types/sequence-note';

export async function getAllInstruments(): Promise<Instrument[]> {
  const instruments: InstrumentDB[] =
    await window.electron.ipcRenderer.invokeMessage('get-all-instruments');
  return adaptInstruments(instruments);
}

export async function prepareFiles(sentence: string): Promise<string[]> {
  const instrumentController: InstrumentController =
    await InstrumentController.getInstance();
  return instrumentController.getFilesToLoadFromSentence(sentence);
}

export async function preparePattern(
  sentence: string,
): Promise<SequenceNotes[]> {
  const instrumentController: InstrumentController =
    await InstrumentController.getInstance();
  return instrumentController.getPatternFromSentence(sentence);
}
