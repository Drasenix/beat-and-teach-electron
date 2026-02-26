import removeDuplicates from '../../../util';
import { Instrument } from '../../instruments/models/instrument-model';
import getAllInstruments from '../../instruments/services/instrument-service';

//  P Ts Kch Ts -> 'kick.mp3' 'hihat.mp3' 'rimshot.mp3'
async function loadRequiredAudioFiles(
  sentence: string,
): Promise<(ArrayBuffer | SharedArrayBuffer)[]> {
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
  const arrayBuffer: (ArrayBuffer | SharedArrayBuffer)[] =
    await loadRequiredAudioFiles(sentence);
  const Tone = await import('tone');

  // TODO
  // gérer le tableau de buffer dans sa totalité
  const context = new Tone.Context();
  const audioBuffer = await context.decodeAudioData(
    arrayBuffer[0] as ArrayBuffer,
  );
  const player = new Tone.Player(audioBuffer).toDestination();
  await Tone.loaded();
  player.start();
}

// P Ts Kch Ts -> 'kick' 'hihat' 'rimshot' 'hihat'
// function convertSentenceToTrack(sentence: string);
