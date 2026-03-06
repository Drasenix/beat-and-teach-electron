import AudioFileBuffer from '../../../../main/audio/models/audio-file-buffer';
import { Instrument } from '../../instruments/models/instrument-model';
import {
  prepareFileNames,
  preparePattern,
} from '../../sequence/services/sequence-service';
import { SequenceNotes } from '../../sequence/types/sequence-note';

export class AudioEngine {
  static #instance: AudioEngine;
  private sentence: string = '';
  private buffers?: AudioFileBuffer;
  private players?: any;
  private Tone: any;

  private constructor() {}

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

  private async createAudioBuffers(): Promise<void> {
    const fileNames: string[] = await prepareFileNames(this.sentence);
    this.buffers = await window.electron.ipcRenderer.invokeMessage(
      'get-audio-buffers',
      fileNames,
    );
  }

  private async createPlayers() {
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

  private async createSequence() {
    const notes: SequenceNotes[] = await preparePattern(this.sentence);
    const seq = new this.Tone.Sequence((time: any, instrument: Instrument) => {
      this.players.player(instrument).start(time);
    }, notes).start(0);
  }

  public async playPattern(): Promise<void> {
    if (this.sentence === '') {
      alert(`Erreur: Aucun pattern n'a été fourni.`);
      return;
    }
    try {
      await this.createAudioBuffers();
      await this.createPlayers();
      await this.createSequence();
      this.Tone.getTransport().start();
    } catch (error: any) {
      alert(`Erreur : ${error}`);
    }
  }

  public stopPattern(): void {
    this.Tone.getTransport().stop();
    this.Tone.getTransport().cancel(0);
  }
}
