import AudioFileBuffer from '../../../../main/audio/models/audio-file-buffer';
import removeDuplicates from '../../../util';
import { Instrument } from '../../instruments/models/instrument-model';
import getAllInstruments from '../../instruments/services/instrument-service';
//  P Ts Kch Ts -> 'kick.mp3' 'hihat.mp3' 'rimshot.mp3'
async function loadRequiredAudioFiles(
  sentence: string,
): Promise<AudioFileBuffer> {
  const symbols: string[] = removeDuplicates(sentence.split(' '));
  const instruments: Instrument[] = await getAllInstruments();

  const fileNames: (string | null)[] = symbols.flatMap((symbol) => {
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

export default async function playSentence(sentence: string): Promise<void> {
  const buffers: AudioFileBuffer = await loadRequiredAudioFiles(sentence);
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
  await Tone.loaded();
  for (const buffer in buffers) {
    players.player(buffer).start();
  }
}
