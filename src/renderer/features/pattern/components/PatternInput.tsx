import { useState } from 'react';
import { Pattern } from '../models/pattern-model';
import useAudio from '../hooks/useAudio';

interface PatternInputComponentProps {
  pattern: Pattern;
  changePatternSentence: (event: any) => void;
}

export default function PatternInputComponent(
  props: PatternInputComponentProps,
) {
  const { pattern, changePatternSentence } = props;
  const { playing, playTrack, stopTrack, changeBpm } = useAudio();
  const [bpm, setBPM] = useState<number>(100);

  const changeBPM = (event: any): void => {
    setBPM(event.target.value);
    changeBpm(bpm);
  };

  return (
    <div>
      <h2>Ton pattern</h2>
      <textarea value={pattern.sentence} onChange={changePatternSentence} />
      <div>
        <button
          type="button"
          disabled={playing}
          onClick={() => playTrack(pattern.sentence, bpm)}
        >
          Play
        </button>
        <button type="button" disabled={!playing} onClick={stopTrack}>
          Stop
        </button>

        <label htmlFor="tempo">
          BPM : {bpm}
          <input
            type="range"
            id="tempo"
            name="tempo"
            min="1"
            max="300"
            onChange={changeBPM}
          />
        </label>
      </div>
    </div>
  );
}
