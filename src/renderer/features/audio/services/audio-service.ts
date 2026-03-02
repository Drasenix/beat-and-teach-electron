import AudioFileBuffer from '../../../../main/audio/models/audio-file-buffer';
import removeDuplicates from '../../../util';
import { Instrument } from '../../instruments/models/instrument-model';
import getAllInstruments from '../../instruments/services/instrument-service';
//  P Ts Kch Ts -> 'kick.mp3' 'hihat.mp3' 'rimshot.mp3'
async function loadRequiredAudioFiles(
  sentence: string,
  instruments: Instrument[],
): Promise<AudioFileBuffer> {
  const symbols: string[] = removeDuplicates(sentence.split(' '));
  const fileNames: string[] = symbols.flatMap((symbol) => {
    const instru: Instrument | undefined = instruments.find(
      (instrument: Instrument) => instrument.symbol === symbol,
    );
    if (instru) {
      return instru.filename;
    }
    console.log('TODO : gérer exception');
    return [];
  });

  return window.electron.ipcRenderer.invokeMessage(
    'get-audio-buffers',
    fileNames,
  );
}

function createPatternFromSentence(
  sentence: string,
  instruments: Instrument[],
): string[] {
  const symbols: string[] = sentence.split(' ');
  const patterns: string[] = symbols.flatMap((symbol) => {
    const instru: Instrument | undefined = instruments.find(
      (instrument: Instrument) => instrument.symbol === symbol,
    );
    if (instru) {
      return instru.name;
    }
    console.log('TODO : gérer exception');
    return [];
  });

  console.log(patterns);
  return patterns;
}

export default async function playSentence(sentence: string): Promise<void> {
  const Tone = await import('tone');
  const instruments: Instrument[] = await getAllInstruments();
  const buffers: AudioFileBuffer = await loadRequiredAudioFiles(
    sentence,
    instruments,
  );
  const players = await createPlayersFromBuffers(buffers);
  const instrus: string[] = createPatternFromSentence(sentence, instruments);

  const seq = new Tone.Sequence((time, instrument) => {
    players.player(instrument).start();
  }, instrus).start(0);

  Tone.getTransport().start();
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
