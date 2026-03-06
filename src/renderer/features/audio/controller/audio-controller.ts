import { AudioEngine } from '../engine/audio-engine';

export async function playPattern(
  sentence: string,
  bpm: number,
): Promise<void> {
  const audioController: AudioEngine = await AudioEngine.getInstance();
  audioController.setSentence(sentence);
  audioController.setTempo(bpm);
  await audioController.playPattern();
}

export async function stopPattern(): Promise<void> {
  const audioController: AudioEngine = await AudioEngine.getInstance();
  audioController.stopPattern();
}

export async function changeTempo(bpm: number): Promise<void> {
  const audioController: AudioEngine = await AudioEngine.getInstance();
  audioController.setTempo(bpm);
}
