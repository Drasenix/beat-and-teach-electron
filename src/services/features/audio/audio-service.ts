export default async function playSentence(sentence: string): Promise<void> {
  console.log(sentence);
  const Tone = await import('tone');
  const player = new Tone.Player(
    'https://tonejs.github.io/audio/berklee/gong_1.mp3',
  ).toDestination();
  player.autostart = true;
}
