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

  private constructor() {}

  public static async getInstance(): Promise<AudioMaster> {
    if (!AudioMaster.#instance) {
      AudioMaster.#instance = new AudioMaster();
      await AudioMaster.#instance.loadInstruments();
    }
    return AudioMaster.#instance;
  }

  public async loadInstruments() {
    this.instruments = await getAllInstruments();
  }

  private async loadRequiredAudioFiles(
    sentence: string,
  ): Promise<AudioFileBuffer> {
    return window.electron.ipcRenderer.invokeMessage(
      'get-audio-buffers',
      getFilesToLoadFromSentence(sentence, this.instruments),
    );
  }

  private async createPlayersFromBuffers(buffers: AudioFileBuffer) {
    const Tone = await import('tone');
    const context = new Tone.Context();
    const players = new Tone.Players();

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
    const Tone = await import('tone');
    const seq = new Tone.Sequence((time, instrument) => {
      players.player(instrument).start();
    }, pattern).start(0);

    Tone.getTransport().start();
  }

  public async playSentence(sentence: string): Promise<void> {
    try {
      const buffers: AudioFileBuffer =
        await this.loadRequiredAudioFiles(sentence);
      const players = await this.createPlayersFromBuffers(buffers);
      const pattern: string[] = getPatternFromSentence(
        sentence,
        this.instruments,
      );

      this.createSequenceFromPattern(players, pattern);
    } catch (error: any) {
      alert(`Erreur : ${error}`);
    }
  }
}
