import playSentence from '../audio/audio-service';
import Pattern from './pattern-model';

interface PatternComponentProps {
  pattern: Pattern;
  selectPattern: (event: any) => void;
}

export default function PatternComponent(props: PatternComponentProps) {
  const { pattern, selectPattern } = props;
  const playPattern = (): void => {
    if (pattern) {
      playSentence(pattern.sentence);
    }
  };
  return (
    <div>
      <textarea value={pattern.sentence} onChange={selectPattern} />
      <button type="button" onClick={playPattern}>
        Ecouter
      </button>
    </div>
  );
}
