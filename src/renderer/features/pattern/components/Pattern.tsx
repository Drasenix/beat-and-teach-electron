import { useState } from 'react';
import { playPattern, stopPattern } from '../../audio/services/audio-service';
import { Pattern } from '../models/pattern-model';

interface PatternComponentProps {
  pattern: Pattern;
  changePatternSentence: (event: any) => void;
}

export default function PatternComponent(props: PatternComponentProps) {
  const { pattern, changePatternSentence } = props;
  const [playing, setPlaying] = useState<boolean>(false);
  const playTrack = (): void => {
    if (pattern) {
      playPattern(pattern.sentence);
      setPlaying(true);
    }
  };

  const stopTrack = (): void => {
    stopPattern();
    setPlaying(false);
  };

  return (
    <div>
      <textarea value={pattern.sentence} onChange={changePatternSentence} />
      <button type="button" disabled={playing} onClick={playTrack}>
        Play
      </button>
      <button type="button" disabled={!playing} onClick={stopTrack}>
        Stop
      </button>
    </div>
  );
}
