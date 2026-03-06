import AudioFileBuffer from '../../../../main/audio/models/audio-file-buffer';
import { Instrument } from '../../instruments/models/instrument-model';
import {
  SequenceNote,
  SequenceNotes,
} from '../../sequence/types/sequence-note';
import * as Tone from 'tone';

export class AudioEngine {
  static #instance: AudioEngine;
  private players?: Tone.Players;

  private constructor() {}

  public static getInstance(): AudioEngine {
    if (!AudioEngine.#instance) {
      AudioEngine.#instance = new AudioEngine();
    }
    return AudioEngine.#instance;
  }

  public setTempo(bpm: number) {
    Tone.getTransport().bpm.value = bpm;
  }

  public async createPlayers(buffers: AudioFileBuffer) {
    const context: Tone.Context = new Tone.Context();
    this.players = new Tone.Players();

    for (const buffer in buffers) {
      const audioBuffer = await context.decodeAudioData(
        buffers[buffer] as ArrayBuffer,
      );
      this.players.add(buffer, audioBuffer);
    }

    this.players.toDestination();
  }

  public async createSequence(notes: SequenceNotes[]) {
    new Tone.Sequence((time: any, note: SequenceNote) => {
      if (this.players && note) {
        this.players.player(note).start(time);
      }
    }, notes).start(0);
  }

  public async playPattern(): Promise<void> {
    Tone.getTransport().start();
  }

  public stopPattern(): void {
    Tone.getTransport().stop();
    Tone.getTransport().cancel(0);
  }
}
