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

  private sequences: Tone.Sequence[] = [];

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
    const context = Tone.getContext();

    if (this.players) {
      this.players.dispose();
    }

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

  public createSequence(tracks: SequenceNotes[][]) {
    this.clearSequences();

    tracks.forEach((notes) => {
      const seq = new Tone.Sequence(
        (time: Tone.Unit.Time, note: SequenceNote) => {
          if (this.players && note) {
            this.players.player(note).start(time);
          }
        },
        notes,
        '8n',
      );

      seq.start(0);
      this.sequences.push(seq);
    });
  }

  private clearSequences(): void {
    this.sequences.forEach((seq) => seq.dispose());
    this.sequences = [];
  }

  // eslint-disable-next-line class-methods-use-this
  public async play(): Promise<void> {
    await Tone.start();
    Tone.getTransport().start('+0.1');
  }

  // eslint-disable-next-line class-methods-use-this
  public stop(): void {
    Tone.getTransport().stop();
    Tone.getTransport().cancel(0);
  }

  public async playInstrument(name: string): Promise<void> {
    await Tone.start();
    this.players?.player(name).start();
  }
}
