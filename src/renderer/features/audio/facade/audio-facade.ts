import AudioFileBuffer from '../../../../shared/types/audio-file-buffer';
import {
  prepareFileNames,
  preparePattern,
} from '../../sequence/facade/sequence-facade';
import { AudioEngine } from '../engine/audio-engine';
import { getAudioBuffers } from '../services/audio-service';

async function createAudioBuffers(sentence: string): Promise<AudioFileBuffer> {
  const fileNames: string[] = await prepareFileNames(sentence);
  return await getAudioBuffers(fileNames);
}

async function prepareAudioEngine(
  sentence: string,
  bpm: number,
): Promise<AudioEngine> {
  const audioEngine: AudioEngine = AudioEngine.getInstance();
  try {
    audioEngine.setTempo(bpm);
    await audioEngine.createPlayers(await createAudioBuffers(sentence));
    audioEngine.createSequence(await preparePattern(sentence));
  } catch (error: any) {
    throw new Error(`Erreur : ${error}`);
  }
  return audioEngine;
}

export async function playPattern(
  sentence: string,
  bpm: number,
): Promise<void> {
  if (!sentence) throw new Error('Aucun pattern fourni');
  const audioEngine: AudioEngine = await prepareAudioEngine(sentence, bpm);
  await audioEngine.play();
}

export async function stopPattern(): Promise<void> {
  const audioEngine: AudioEngine = AudioEngine.getInstance();
  audioEngine.stop();
}

export async function changeTempo(bpm: number): Promise<void> {
  const audioEngine: AudioEngine = AudioEngine.getInstance();
  audioEngine.setTempo(bpm);
}
