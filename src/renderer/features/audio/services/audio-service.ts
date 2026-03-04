import AudioFileBuffer from '../../../../main/audio/models/audio-file-buffer';
import { prepareFiles } from '../../instruments/services/instrument-service';
import { AudioController } from '../controller/audio-controller';

export async function createAudioBuffers(
  sentence: string,
): Promise<AudioFileBuffer> {
  return await window.electron.ipcRenderer.invokeMessage(
    'get-audio-buffers',
    await prepareFiles(sentence),
  );
}
export async function playPattern(
  sentence: string,
  bpm: number,
): Promise<void> {
  const audioController: AudioController = await AudioController.getInstance();
  audioController.setSentence(sentence);
  audioController.setTempo(bpm);
  await audioController.playPattern();
}

export async function stopPattern(): Promise<void> {
  const audioController: AudioController = await AudioController.getInstance();
  audioController.stopPattern();
}

export async function changeTempo(bpm: number): Promise<void> {
  const audioController: AudioController = await AudioController.getInstance();
  audioController.setTempo(bpm);
}
