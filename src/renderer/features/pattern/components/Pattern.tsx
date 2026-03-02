import { playPattern, stopPattern } from '../../audio/services/audio-service';
import { Pattern } from '../models/pattern-model';

interface PatternComponentProps {
  pattern: Pattern;
  changePatternSentence: (event: any) => void;
}

export default function PatternComponent(props: PatternComponentProps) {
  const { pattern, changePatternSentence } = props;
  const playTrack = (): void => {
    if (pattern) {
      playPattern(pattern.sentence);
    }
  };

  const stopTrack = (): void => {
    stopPattern();
  };

  return (
    <div>
      <textarea value={pattern.sentence} onChange={changePatternSentence} />
      <button type="button" onClick={playTrack}>
        Play
      </button>
      <button type="button" onClick={stopTrack}>
        Stop
      </button>
    </div>
  );
}
