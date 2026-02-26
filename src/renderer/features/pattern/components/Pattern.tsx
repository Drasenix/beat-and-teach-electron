import playSentence from '../../audio/services/audio-service';
import { Pattern } from '../models/pattern-model';

interface PatternComponentProps {
  pattern: Pattern;
  changePatternSentence: (event: any) => void;
}

export default function PatternComponent(props: PatternComponentProps) {
  const { pattern, changePatternSentence } = props;
  const playPattern = (): void => {
    if (pattern) {
      playSentence(pattern.sentence);
    }
  };
  return (
    <div>
      <textarea value={pattern.sentence} onChange={changePatternSentence} />
      <button type="button" onClick={playPattern}>
        Ecouter
      </button>
    </div>
  );
}
