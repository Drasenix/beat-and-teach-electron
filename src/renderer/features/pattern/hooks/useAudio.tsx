import { useState } from 'react';
import {
  changeTempo,
  playPattern,
  stopPattern,
} from '../../audio/controller/audio-controller';

const useAudio = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const playTrack = (sentence: string, bpm: number): void => {
    playPattern(sentence, bpm);
    setPlaying(true);
  };

  const stopTrack = (): void => {
    stopPattern();
    setPlaying(false);
  };

  const changeBpm = (bpm: number): void => {
    changeTempo(bpm);
  };

  return { playing, playTrack, stopTrack, changeBpm };
};

export default useAudio;
