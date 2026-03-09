import { useState } from 'react';
import { Pattern } from '../models/pattern-model';
import useAudio from '../../audio/hooks/useAudio';
import useInstruments from '../../instruments/hooks/useInstruments';

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
        </label>
      </div>

      {/* Contrôles */}
      <div className="w-full max-w-2xl mt-6 flex items-center gap-4">
        <button
          type="button"
          disabled={playing || !pattern.sentence}
          onClick={() => playTrack(pattern.sentence, bpm)}
          className="btn-primary"
        >
          ▶ Play
        </button>

        <button
          type="button"
          disabled={!playing}
          onClick={stopTrack}
          className="btn-secondary"
        >
          ■ Stop
        </button>

        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-primary uppercase tracking-widest">BPM</span>
            <span className="text-text-accent font-bold">{bpm}</span>
          </div>
          <input
            type="range"
            id="tempo"
            name="tempo"
            min="1"
            max="300"
            value={bpm}
            onChange={changeBPM}
            className="w-full accent-primary cursor-pointer"
          />
        </div>
      </div>

      {error && (
        <div className="w-full max-w-2xl mt-4 error-message">{error}</div>
      )}

      {/* Légende instruments */}
      <div className="w-full max-w-2xl mt-8 p-4 bg-surface rounded-lg border border-border">
        <p className="section-title mb-2">Symboles disponibles</p>
        <div className="flex flex-wrap gap-3">
          {instruments.map((instrument) => (
            <div
              key={instrument.id}
              className="flex items-center gap-2 bg-background px-3 py-1 rounded-full border border-border"
            >
              <span className="text-primary font-mono font-bold">
                {instrument.symbol}
              </span>
              <span className="text-text-secondary text-xs">
                {instrument.slug ?? 'error: no slug defined'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
