import { useState } from 'react';
import { playPattern, stopPattern } from '../../audio/services/audio-service';

const useAudio = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const playTrack = (sentence: string): void => {
    playPattern(sentence);
    setPlaying(true);
  };

  const stopTrack = (): void => {
    stopPattern();
    setPlaying(false);
  };

  return { playing, playTrack, stopTrack };
};

export default useAudio;
