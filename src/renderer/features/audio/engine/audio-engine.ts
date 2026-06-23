import * as Tone from 'tone';
import AudioFileBuffer from '../../../../shared/types/audio-file-buffer';
import {
  SequenceNotes,
  SequenceNote,
} from '../../sequence/types/sequence-note';

export type StepCallback = (stepIndex: number) => void;

export default class AudioEngine {
  // eslint-disable-next-line no-use-before-define
  static #instance: AudioEngine;

  private decodedBuffers: Map<string, AudioBuffer> = new Map();

  private playerPool: Map<string, Map<number, Tone.Player>>[] = [];

  private trackLoops: Tone.Loop[] = [];

  private onStep?: StepCallback;

  private loadedSymbols: Set<string> = new Set();

  private currentColumnCount: number = 0;

  private stepDuration: number = 0;

  private trackNotes: SequenceNotes[][] = [];

  public static getInstance(): AudioEngine {
    if (!AudioEngine.#instance) {
      AudioEngine.#instance = new AudioEngine();
    }
    return AudioEngine.#instance;
  }

  public setTempo(bpm: number) {
    Tone.getTransport().bpm.value = bpm;
    this.stepDuration = Tone.Time('8n').toSeconds();
  }

  public async createPlayers(audioBuffers: AudioFileBuffer) {
    const context = Tone.getContext();

    const entries = Object.entries(audioBuffers);
    const decoded = await Promise.all(
      entries.map(([, buffer]) =>
        context.decodeAudioData(buffer as ArrayBuffer),
      ),
    );

    entries.forEach(([instrumentName], index) => {
      this.decodedBuffers.set(instrumentName, decoded[index]);
    });
  }

  private getPoolPlayer(
    trackIndex: number,
    instrumentName: string,
    semitoneOffset: number,
    playbackRate: number,
  ): Tone.Player | undefined {
    if (!this.playerPool[trackIndex]) {
      this.playerPool[trackIndex] = new Map();
    }

    const trackPool = this.playerPool[trackIndex];
    let offsetPool = trackPool.get(instrumentName);
    if (!offsetPool) {
      offsetPool = new Map();
      trackPool.set(instrumentName, offsetPool);
    }

    const existing = offsetPool.get(semitoneOffset);
    if (existing) return existing;

    const buffer = this.decodedBuffers.get(instrumentName);
    if (!buffer) return undefined;

    const player = new Tone.Player(buffer).toDestination();
    player.playbackRate = playbackRate;
    offsetPool.set(semitoneOffset, player);
    return player;
  }

  private buildTrackLoops(): void {
    this.clearTrackLoops();

    this.trackNotes.forEach((_trackNotes, trackIndex) => {
      let localStep = 0;
      const loop = new Tone.Loop((time) => {
        if (this.currentColumnCount <= 0) return;
        const step = localStep % this.currentColumnCount;

        const notes = this.trackNotes[trackIndex];
        if (!notes || step >= notes.length) return;
        const note = notes[step];
        if (note !== null && !Array.isArray(note) && note.name !== null) {
          this.playNote(trackIndex, note, time);
        } else if (Array.isArray(note)) {
          const subCount = note.length;
          note.forEach((n: SequenceNote, i) => {
            const offset = (i * this.stepDuration) / subCount;
            this.playNote(trackIndex, n, time + offset);
          });
        }

        if (trackIndex === 0 && this.onStep) {
          this.onStep(step);
        }
        localStep += 1;
      }, '8n');
      try {
        loop.start(0);
      } catch (error: unknown) {
        console.error('[AudioEngine] loop.start error', error);
      }
      this.trackLoops.push(loop);
    });
  }

  private playNote(
    trackIndex: number,
    note: SequenceNote,
    noteTime: number,
  ): void {
    if (note === null || note.name === null) return;

    const offset = note.semitoneOffset ?? 0;

    const player = this.getPoolPlayer(
      trackIndex,
      note.name,
      offset,
      note.playbackRate,
    );
    if (!player) return;

    try {
      player.start(noteTime);
    } catch (error: unknown) {
      console.error('[AudioEngine] playNote error', error);
    }
  }

  public createSequence(tracks: SequenceNotes[][]): void {
    this.clearAll();

    this.trackNotes = tracks;
    this.currentColumnCount = tracks[0]?.length ?? 0;

    if (!this.onStep) return;

    try {
      this.buildTrackLoops();
    } catch (error: unknown) {
      console.error('[AudioEngine] build error', error);
    }
  }

  private clearTrackLoops(): void {
    this.trackLoops.forEach((loop) => loop.dispose());
    this.trackLoops = [];
  }

  private clearAll(): void {
    this.clearTrackLoops();
    this.playerPool.forEach((trackPool) => {
      trackPool.forEach((offsetPool) => {
        offsetPool.forEach((player) => player.dispose());
      });
    });
    this.playerPool = [];
    this.trackNotes = [];
    this.currentColumnCount = 0;
  }

  // eslint-disable-next-line class-methods-use-this
  public async play(): Promise<void> {
    await Tone.start();
    Tone.getTransport().start('+0.1');
  }

  public stop(): void {
    Tone.getTransport().stop();
    Tone.getTransport().cancel(0);
    this.clearTrackLoops();
  }

  public async playInstrument(name: string): Promise<void> {
    await Tone.start();
    const buffer = this.decodedBuffers.get(name);
    if (!buffer) return;
    const player = new Tone.Player(buffer).toDestination();
    player.start();
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
    const context = Tone.getContext();
    const entries = Object.entries(audioBuffers);
    const decoded = await Promise.all(
      entries.map(([, buffer]) =>
        context.decodeAudioData(buffer as ArrayBuffer),
      ),
    );

    entries.forEach(([instrumentName], index) => {
      this.decodedBuffers.set(instrumentName, decoded[index]);
    });
  }

  public updateSequences(tracks: SequenceNotes[][]): void {
    if (this.trackLoops.length === 0) return;

    this.trackNotes = tracks;

    if (tracks.length !== this.trackLoops.length) {
      try {
        this.buildTrackLoops();
      } catch (error: unknown) {
        console.error('[AudioEngine] updateSequences build error', error);
      }
    }

    const newColumnCount = tracks[0]?.length ?? 0;
    this.currentColumnCount = newColumnCount;
  }
}
