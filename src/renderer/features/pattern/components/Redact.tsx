import PatternComponent from './Pattern';
import usePattern from '../hooks/usePattern';

export default function Redact() {
  const { pattern, changePatternSentence } = usePattern();
  const legende: string =
    'Rédigez votre pattern en marquant les silences par des points .';

  return (
    <div>
      <h2>{legende}</h2>
      <PatternComponent
        pattern={pattern}
        changePatternSentence={changePatternSentence}
      />
    </div>
  );
}
