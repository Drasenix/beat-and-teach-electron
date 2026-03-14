import AudioFileBuffer from '../../../../shared/types/audio-file-buffer';
import { InstrumentFilePath } from '../../../../shared/types/instrument';
import {
  prepareFilePaths,
  preparePattern,
} from '../../sequence/facade/sequence-facade';
import { SequenceNotes } from '../../sequence/types/sequence-note';
import AudioEngine from '../engine/audio-engine';
import getAudioBuffers from '../services/audio-service';

async function createAudioBuffers(
  sentences: string[],
): Promise<AudioFileBuffer> {
  const allFilePaths: InstrumentFilePath[][] = await Promise.all(
    sentences.map((sentence) => prepareFilePaths(sentence)),
  );
  return getAudioBuffers(allFilePaths.flat());
}

async function prepareAudioEngine(
  sentences: string[],
  bpm: number,
): Promise<AudioEngine> {
  const audioEngine: AudioEngine = AudioEngine.getInstance();
  try {
    audioEngine.setTempo(bpm);
    await audioEngine.createPlayers(await createAudioBuffers(sentences));
    const allNotes: SequenceNotes[][] = await Promise.all(
      sentences.map((sentence) => preparePattern(sentence)),
    );
    audioEngine.createSequence(allNotes);
  } catch (error: any) {
    throw new Error(`Erreur : ${error}`);
  }
  return audioEngine;
}

export async function playPattern(
  sentences: string[],
  bpm: number,
): Promise<void> {
  if (!sentences.length) throw new Error('Aucun pattern fourni');
  const audioEngine: AudioEngine = await prepareAudioEngine(sentences, bpm);
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
