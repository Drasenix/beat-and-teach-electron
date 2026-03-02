import { AudioMaster } from '../models/AudioMaster';

export default async function playSentence(sentence: string): Promise<void> {
  const audioMaster: AudioMaster = await AudioMaster.getInstance();
  await audioMaster.playSentence(sentence);
}
