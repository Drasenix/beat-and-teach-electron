import { AudioController } from '../controller/audio-controller';

export async function playPattern(sentence: string): Promise<void> {
  const audioController: AudioController = await AudioController.getInstance();
  audioController.setSentence(sentence);
  await audioController.playPattern();
}

export async function stopPattern(): Promise<void> {
  const audioMaster: AudioController = await AudioController.getInstance();
  audioMaster.stopPattern();
}
