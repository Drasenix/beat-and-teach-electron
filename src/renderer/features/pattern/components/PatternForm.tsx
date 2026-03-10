import { useState } from 'react';
import { Pattern } from '../models/pattern-model';
import useAudio from '../../audio/hooks/useAudio';
import PatternControls from './PatternControls';
import PatternLegend from './PatternLegend';
import PatternEditor from './PatternEditor';

type PatternFormComponentProps = {
  pattern: Pattern;
  changePatternSentence: (event: any) => void;
};

export default function PatternFormComponent(props: PatternFormComponentProps) {
  const { pattern, changePatternSentence } = props;
  const { playing, playTrack, stopTrack, changeBpm } = useAudio();
  const [bpm, setBPM] = useState<number>(100);

  const changeBPM = (event: any): void => {
    const newBpm = Number(event.target.value);
    setBPM(newBpm);
    changeBpm(newBpm);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <PatternEditor
        pattern={pattern}
        changePatternSentence={changePatternSentence}
      />

      <PatternControls
        playing={playing}
        sentence={pattern.sentence}
        bpm={bpm}
        onPlay={() => playTrack(pattern.sentence, bpm)}
        onStop={stopTrack}
        onChangeBpm={changeBPM}
      />

      <PatternLegend />
    </div>
  );
}
