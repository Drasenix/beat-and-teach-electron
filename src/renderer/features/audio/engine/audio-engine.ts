import * as Tone from 'tone';
import AudioFileBuffer from '../../../../shared/types/audio-file-buffer';
import {
  SequenceNote,
  SequenceNotes,
} from '../../sequence/types/sequence-note';

export default class AudioEngine {
  // eslint-disable-next-line no-use-before-define
  static #instance: AudioEngine;

  private players?: Tone.Players;

  public static getInstance(): AudioEngine {
    if (!AudioEngine.#instance) {
      AudioEngine.#instance = new AudioEngine();
    }
    return AudioEngine.#instance;
  }

  // eslint-disable-next-line class-methods-use-this
  public setTempo(bpm: number) {
    Tone.getTransport().bpm.value = bpm;
  }

  public async createPlayers(audioBuffers: AudioFileBuffer) {
    const context: Tone.Context = new Tone.Context();
    this.players = new Tone.Players();

    const buffers = Object.entries(audioBuffers);
    const decoded = await Promise.all(
      buffers.map(([, buffer]) =>
        context.decodeAudioData(buffer as ArrayBuffer),
      ),
    );

    buffers.forEach(([instrumentName], index) => {
      this.players!.add(instrumentName, decoded[index]);
    });

    this.players.toDestination();
  }

  public createSequence(notes: SequenceNotes[]) {
    new Tone.Sequence((time: any, note: SequenceNote) => {
      if (this.players && note) {
        this.players.player(note).start(time);
      }
    }, notes).start(0);
  }

  // eslint-disable-next-line class-methods-use-this
  public async play(): Promise<void> {
    Tone.getTransport().start();
  }

  // eslint-disable-next-line class-methods-use-this
  public stop(): void {
    Tone.getTransport().stop();
    Tone.getTransport().cancel(0);
  }
}
