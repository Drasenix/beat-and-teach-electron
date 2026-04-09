import * as Tone from 'tone';
import AudioFileBuffer from '../../../../shared/types/audio-file-buffer';
import { SequenceNotes } from '../../sequence/types/sequence-note';

export type StepCallback = (stepIndex: number) => void;

export default class AudioEngine {
  // eslint-disable-next-line no-use-before-define
  static #instance: AudioEngine;

  private players?: Tone.Players;

  private sequences: Tone.Sequence[] = [];

  private stepLoop?: Tone.Loop;

  private onStep?: StepCallback;

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

  public createSequence(tracks: SequenceNotes[][]): void {
    this.clearAll();

    tracks.forEach((notes) => {
      const seq = new Tone.Sequence(
        (time, note) => {
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

    this.createStepLoop(tracks[0].length);
  }

  private createStepLoop(columnCount: number): void {
    if (!this.onStep) return;

    let stepIndex = 0;
    this.stepLoop = new Tone.Loop(() => {
      const current = stepIndex % columnCount;
      this.onStep!(current);
      stepIndex += 1;
    }, '8n').start(0);
  }

  private clearSequences(): void {
    this.sequences.forEach((seq) => seq.dispose());
    this.sequences = [];
  }

  private clearStepLoop(): void {
    if (this.stepLoop) {
      this.stepLoop.dispose();
      this.stepLoop = undefined;
    }
  }

  private clearAll(): void {
    this.clearSequences();
    this.clearStepLoop();
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
    this.clearStepLoop();
  }

  public async playInstrument(name: string): Promise<void> {
    await Tone.start();
    this.players?.player(name).start();
  }

  public setStepCallback(callback: StepCallback): void {
    this.onStep = callback;
  }

  public clearStepCallback(): void {
    this.onStep = undefined;
  }
}
