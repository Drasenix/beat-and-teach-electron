import { useMemo, useState } from 'react';
import { Pattern } from '../models/pattern-model';
import useAudio from '../../audio/hooks/useAudio';
import useInstruments from '../../instruments/hooks/useInstruments';
import { parseTokens } from '../utils/pattern-parser';
import PatternTokens from './PatternTokens';
import PatternControls from './PatternControls';
import PatternLegend from './PatternLegend';

type PatternInputComponentProps = {
  pattern: Pattern;
  changePatternSentence: (event: any) => void;
};

export default function PatternInputComponent(
  props: PatternInputComponentProps,
) {
  const { pattern, changePatternSentence } = props;
  const { playing, playTrack, stopTrack, changeBpm } = useAudio();
  const { instruments, error } = useInstruments();
  const [bpm, setBPM] = useState<number>(100);
  const tokens = useMemo(
    () =>
      parseTokens(
        pattern.sentence,
        instruments.map((i) => i.symbol),
      ),
    [pattern.sentence, instruments],
  );

  const changeBPM = (event: any): void => {
    const newBpm = Number(event.target.value);
    setBPM(newBpm);
    changeBpm(newBpm);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Zone de saisie */}
      <div className="w-full max-w-2xl">
        <label htmlFor="pattern-input" className="section-title block mb-2">
          Pattern
          <textarea
            id="pattern-input"
            value={pattern.sentence}
            onChange={changePatternSentence}
            placeholder={pattern.sentence || 'P Ts K . P (Ts P) K'}
            className="input-field w-full text-xl p-4 resize-none h-24 mt-2"
          />
          <PatternTokens tokens={tokens} />
        </label>
      </div>

      <PatternControls
        playing={playing}
        sentence={pattern.sentence}
        bpm={bpm}
        onPlay={() => playTrack(pattern.sentence, bpm)}
        onStop={stopTrack}
        onChangeBpm={changeBPM}
      />

      {error && (
        <div className="w-full max-w-2xl mt-4 error-message">{error}</div>
      )}

      <PatternLegend instruments={instruments} />
    </div>
  );
}
