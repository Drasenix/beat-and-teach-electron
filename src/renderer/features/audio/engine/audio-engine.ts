import AudioFileBuffer from '../../../../main/audio/models/audio-file-buffer';
import { Instrument } from '../../instruments/models/instrument-model';
import { SequenceNotes } from '../../sequence/types/sequence-note';

export class AudioEngine {
  static #instance: AudioEngine;
  private sentence: string = '';
  private _buffers?: AudioFileBuffer | undefined;
  private players?: any;
  private Tone: any;

  private constructor() {}

  public get buffers(): AudioFileBuffer | undefined {
    return this._buffers;
  }
  public set buffers(value: AudioFileBuffer | undefined) {
    this._buffers = value;
  }

  public static async getInstance(): Promise<AudioEngine> {
    if (!AudioEngine.#instance) {
      AudioEngine.#instance = new AudioEngine();
      await AudioEngine.#instance.importTone();
    }
    return AudioEngine.#instance;
  }

  public setSentence(sentence: string): void {
    this.sentence = sentence;
  }

  public setTempo(bpm: number) {
    this.Tone.Transport.bpm.value = bpm;
  }

  protected async importTone() {
    this.Tone = await import('tone');
  }

  public async createPlayers() {
    const context = new this.Tone.Context();
    this.players = new this.Tone.Players();

    for (const buffer in this.buffers) {
      const audioBuffer = await context.decodeAudioData(
        this.buffers[buffer] as ArrayBuffer,
      );
      this.players.add(buffer, audioBuffer);
    }

    this.players.toDestination();
  }

  public async createSequence(notes: SequenceNotes[]) {
    new this.Tone.Sequence((time: any, instrument: Instrument) => {
      this.players.player(instrument).start(time);
    }, notes).start(0);
  }

  public async playPattern(): Promise<void> {
    if (this.sentence === '') {
      throw new Error(`Erreur: Aucun pattern n'a été fourni.`);
    }
    this.Tone.getTransport().start();
  }

  public stopPattern(): void {
    this.Tone.getTransport().stop();
    this.Tone.getTransport().cancel(0);
  }
}
