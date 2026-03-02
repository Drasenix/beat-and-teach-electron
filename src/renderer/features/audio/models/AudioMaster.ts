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

  private async loadRequiredAudioFiles(): Promise<AudioFileBuffer> {
    return window.electron.ipcRenderer.invokeMessage(
      'get-audio-buffers',
      getFilesToLoadFromSentence(this.sentence, this.instruments),
    );
  }

  private async createPlayersFromBuffers(buffers: AudioFileBuffer) {
    const context = new this.Tone.Context();
    const players = new this.Tone.Players();

    for (const buffer in buffers) {
      const audioBuffer = await context.decodeAudioData(
        buffers[buffer] as ArrayBuffer,
      );
      players.add(buffer, audioBuffer);
    }

    players.toDestination();

    return players;
  }

  private async createSequenceFromPattern(players: any, pattern: string[]) {
    const seq = new this.Tone.Sequence((time: any, instrument: Instrument) => {
      players.player(instrument).start();
    }, pattern).start(0);
  }

  public async playPattern(): Promise<void> {
    try {
      const buffers: AudioFileBuffer = await this.loadRequiredAudioFiles();
      const players = await this.createPlayersFromBuffers(buffers);
      const pattern: string[] = getPatternFromSentence(
        this.sentence,
        this.instruments,
      );

      this.createSequenceFromPattern(players, pattern);
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
