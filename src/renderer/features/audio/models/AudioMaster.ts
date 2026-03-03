import AudioFileBuffer from '../../../../main/audio/models/audio-file-buffer';
import { Instrument } from '../../instruments/models/instrument-model';
import {
  getAllInstruments,
  getFilesToLoadFromSentence,
  getPatternFromSentence,
} from '../../instruments/services/instrument-service';

export class AudioMaster {
  static #instance: AudioMaster;
  private instruments: Instrument[] = [];
  private sentence: string = '';
  private buffers?: AudioFileBuffer;
  private players?: any;
  private Tone: any;

  private constructor() {}

  public static async getInstance(): Promise<AudioMaster> {
    if (!AudioMaster.#instance) {
      AudioMaster.#instance = new AudioMaster();
      await AudioMaster.#instance.loadInstruments();
      await AudioMaster.#instance.importTone();
    }
    return AudioMaster.#instance;
  }

  public setSentence(sentence: string): void {
    this.sentence = sentence;
  }

  protected async loadInstruments() {
    this.instruments = await getAllInstruments();
  }

  protected async importTone() {
    this.Tone = await import('tone');
  }

  private async createAudioBuffers(): Promise<void> {
    this.buffers = await window.electron.ipcRenderer.invokeMessage(
      'get-audio-buffers',
      getFilesToLoadFromSentence(this.sentence, this.instruments),
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

  private async createSequence(pattern: string[]) {
    const seq = new this.Tone.Sequence((time: any, instrument: Instrument) => {
      this.players.player(instrument).start();
    }, pattern).start(0);
  }

  public async playPattern(): Promise<void> {
    if (this.sentence === '') {
      alert(`Erreur: Aucun pattern n'a été fourni.`);
      return;
    }
    try {
      await this.createAudioBuffers();
      await this.createPlayers();
      const pattern: string[] = getPatternFromSentence(
        this.sentence,
        this.instruments,
      );

      await this.createSequence(pattern);
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
