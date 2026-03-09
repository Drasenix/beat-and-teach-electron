import { useState } from 'react';
import { changeTempo, playPattern, stopPattern } from '../facade/audio-facade';

const useAudio = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const playTrack = async (sentence: string, bpm: number): Promise<void> => {
    try {
      await playPattern(sentence, bpm);
      setPlaying(true);
    } catch (error) {
      alert(error);
    }
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
