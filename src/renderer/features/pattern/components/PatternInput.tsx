import { useState } from 'react';
import { Pattern } from '../models/pattern-model';
import useAudio from '../../audio/hooks/useAudio';

type PatternInputComponentProps = {
  pattern: Pattern;
  changePatternSentence: (event: any) => void;
};

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
    <div className="flex flex-col items-center w-full">
      {/* Zone de saisie */}
      <div className="w-full max-w-2xl">
        <label
          htmlFor="pattern-input"
          className="block text-xs font-mono text-primary uppercase tracking-widest mb-2"
        >
          Pattern
          <textarea
            id="pattern-input"
            value={pattern.sentence}
            onChange={changePatternSentence}
            placeholder={pattern.sentence || 'P Ts K . P (Ts P) K'}
            className="w-full bg-surface border border-border focus:border-primary focus:outline-none
                       text-text-accent font-mono text-xl p-4 rounded-lg resize-none h-24
                       placeholder-border transition-colors duration-200 mt-2"
          />
        </label>
      </div>

      {/* Contrôles */}
      <div className="w-full max-w-2xl mt-6 flex items-center gap-4">
        {/* Play */}
        <button
          type="button"
          disabled={playing}
          onClick={() => playTrack(pattern.sentence, bpm)}
          className="px-6 py-3 bg-primary hover:opacity-90 disabled:opacity-30
                     disabled:cursor-not-allowed text-background font-bold rounded-lg
                     uppercase tracking-widest transition-opacity duration-200"
        >
          ▶ Play
        </button>

        {/* Stop */}
        <button
          type="button"
          disabled={!playing}
          onClick={stopTrack}
          className="px-6 py-3 bg-surface hover:opacity-90 disabled:opacity-30
                     disabled:cursor-not-allowed text-text-primary font-bold rounded-lg
                     uppercase tracking-widest transition-opacity duration-200 border border-border"
        >
          ■ Stop
        </button>

        {/* BPM */}
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

      {/* Légende instruments */}
      <div className="w-full max-w-2xl mt-8 p-4 bg-surface rounded-lg border border-border">
        <p className="text-xs font-mono text-text-secondary uppercase tracking-widest mb-2">
          Symboles disponibles
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { symbol: 'P', name: 'Kickdrum' },
            { symbol: 'Ts', name: 'Hi-hat' },
            { symbol: 'Pf', name: 'Snare' },
            { symbol: 'K', name: 'Rimshot' },
            { symbol: '.', name: 'Silence' },
          ].map(({ symbol, name }) => (
            <div
              key={symbol}
              className="flex items-center gap-2 bg-background px-3 py-1 rounded-full border border-border"
            >
              <span className="text-primary font-mono font-bold">{symbol}</span>
              <span className="text-text-secondary text-xs">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
