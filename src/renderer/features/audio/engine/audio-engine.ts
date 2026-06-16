import * as Tone from 'tone';
import AudioFileBuffer from '../../../../shared/types/audio-file-buffer';
import { SequenceNotes } from '../../sequence/types/sequence-note';

export type StepCallback = (stepIndex: number) => void;

export default class AudioEngine {
  // eslint-disable-next-line no-use-before-define
  static #instance: AudioEngine;

  private players?: Tone.Players;

  private masterLoop?: Tone.Loop;

  private onStep?: StepCallback;

  private loadedSymbols: Set<string> = new Set();

  private currentColumnCount: number = 0;

  private stepIndex: number = 0;

  private stepDuration: number = 0;

  private trackNotes: SequenceNotes[][] = [];

  public static getInstance(): AudioEngine {
    if (!AudioEngine.#instance) {
      AudioEngine.#instance = new AudioEngine();
    }
    return AudioEngine.#instance;
  }

  // eslint-disable-next-line class-methods-use-this
  public setTempo(bpm: number) {
    Tone.getTransport().bpm.value = bpm;
    this.stepDuration = Tone.Time('8n').toSeconds();
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

    this.trackNotes = tracks;
    this.currentColumnCount = tracks[0]?.length ?? 0;
    this.stepIndex = 0;

    if (!this.onStep) return;

    this.masterLoop = new Tone.Loop((time) => {
      if (this.currentColumnCount <= 0) return;
      const step = this.stepIndex % this.currentColumnCount;

      this.trackNotes.forEach((trackNotes) => {
        if (step >= trackNotes.length) return;
        const note = trackNotes[step];
        if (typeof note === 'string') {
          this.players?.player(note).start(time);
        } else if (Array.isArray(note)) {
          const subCount = note.length;
          note.forEach((n, i) => {
            if (typeof n === 'string') {
              const offset = (i * this.stepDuration) / subCount;
              this.players?.player(n).start(time + offset);
            }
          });
        }
      });

      this.onStep!(step);
      this.stepIndex += 1;
    }, '8n');
    this.masterLoop.start(0);
  }

  private clearMasterLoop(): void {
    if (this.masterLoop) {
      this.masterLoop.dispose();
      this.masterLoop = undefined;
    }
  }

  private clearAll(): void {
    this.clearMasterLoop();
    this.trackNotes = [];
    this.currentColumnCount = 0;
    this.stepIndex = 0;
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
    this.clearMasterLoop();
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

  public hasSymbol(symbol: string): boolean {
    return this.loadedSymbols.has(symbol);
  }

  public registerSymbol(symbol: string): void {
    this.loadedSymbols.add(symbol);
  }

  public async addToPlayers(audioBuffers: AudioFileBuffer): Promise<void> {
    if (!this.players) return;
    const context = Tone.getContext();
    const buffers = Object.entries(audioBuffers);
    const decoded = await Promise.all(
      buffers.map(([, buffer]) =>
        context.decodeAudioData(buffer as ArrayBuffer),
      ),
    );
    buffers.forEach(([instrumentName], index) => {
      this.players!.add(instrumentName, decoded[index]);
    });
  }

  public updateSequences(tracks: SequenceNotes[][]): void {
    if (!this.masterLoop) return;

    this.trackNotes = tracks;
    const newColumnCount = tracks[0]?.length ?? 0;
    if (newColumnCount !== this.currentColumnCount) {
      const oldPosition = this.stepIndex % this.currentColumnCount;
      this.currentColumnCount = newColumnCount;
      this.stepIndex = oldPosition;
    }
  }
}
