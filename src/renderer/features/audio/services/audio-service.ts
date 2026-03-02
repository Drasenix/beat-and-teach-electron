import { AudioMaster } from '../models/AudioMaster';

export async function playPattern(sentence: string): Promise<void> {
  const audioMaster: AudioMaster = await AudioMaster.getInstance();
  audioMaster.setSentence(sentence);
  await audioMaster.playPattern();
}

export async function stopPattern(): Promise<void> {
  const audioMaster: AudioMaster = await AudioMaster.getInstance();
  audioMaster.stopPattern();
}
