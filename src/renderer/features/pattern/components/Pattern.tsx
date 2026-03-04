import { Pattern } from '../models/pattern-model';
import useAudio from '../hooks/useAudio';

interface PatternComponentProps {
  pattern: Pattern;
  changePatternSentence: (event: any) => void;
}

export default function PatternComponent(props: PatternComponentProps) {
  const { pattern, changePatternSentence } = props;
  const { playing, playTrack, stopTrack } = useAudio();

  return (
    <div>
      <textarea value={pattern.sentence} onChange={changePatternSentence} />
      <button
        type="button"
        disabled={playing}
        onClick={() => playTrack(pattern.sentence)}
      >
        Play
      </button>
      <button type="button" disabled={!playing} onClick={stopTrack}>
        Stop
      </button>
    </div>
  );
}
