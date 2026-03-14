import { useState } from 'react';
import { changeTempo, playPattern, stopPattern } from '../facade/audio-facade';

const useAudio = () => {
  const [playing, setPlaying] = useState<boolean>(false);

  const playTrack = async (sentences: string[], bpm: number): Promise<void> => {
    try {
      await playPattern(sentences, bpm);
      setPlaying(true);
    } catch (error) {
      // eslint-disable-next-line no-alert
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
