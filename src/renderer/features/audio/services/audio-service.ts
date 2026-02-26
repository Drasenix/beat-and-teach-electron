export default async function playSentence(sentence: string): Promise<void> {
  console.log(sentence);
  const Tone = await import('tone');

  const arrayBuffer: ArrayBuffer | SharedArrayBuffer =
    await window.electron.ipcRenderer.invokeMessage(
      'get-audio-buffer',
      'hihat.mp3',
    );

  const context = new Tone.Context();
  const audioBuffer = await context.decodeAudioData(arrayBuffer as ArrayBuffer);
  const player = new Tone.Player(audioBuffer).toDestination();
  await Tone.loaded();
  player.start();
}
