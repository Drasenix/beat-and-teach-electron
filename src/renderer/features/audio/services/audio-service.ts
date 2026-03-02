import AudioFileBuffer from '../../../../main/audio/models/audio-file-buffer';
import { Instrument } from '../../instruments/models/instrument-model';
import {
  getAllInstruments,
  getFilesToLoadFromSentence,
  getPatternFromSentence,
} from '../../instruments/services/instrument-service';

async function loadRequiredAudioFiles(
  sentence: string,
  instruments: Instrument[],
): Promise<AudioFileBuffer> {
  return window.electron.ipcRenderer.invokeMessage(
    'get-audio-buffers',
    getFilesToLoadFromSentence(sentence, instruments),
  );
}

export default async function playSentence(sentence: string): Promise<void> {
  const Tone = await import('tone');
  const instruments: Instrument[] = await getAllInstruments();
  try {
    const buffers: AudioFileBuffer = await loadRequiredAudioFiles(
      sentence,
      instruments,
    );
    const players = await createPlayersFromBuffers(buffers);
    const instrus: string[] = getPatternFromSentence(sentence, instruments);

    const seq = new Tone.Sequence((time, instrument) => {
      players.player(instrument).start();
    }, instrus).start(0);

    Tone.getTransport().start();
  } catch (error: any) {
    alert(`Erreur : ${error}`);
  }
}

async function createPlayersFromBuffers(buffers: AudioFileBuffer) {
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
