import { useState } from 'react';
import useAudio from '../hooks/useAudio';

type AudioControlsProps = {
  sentence: string;
};

export default function AudioControls({ sentence }: AudioControlsProps) {
  const { playing, playTrack, stopTrack, changeBpm } = useAudio();
  const [bpm, setBPM] = useState<number>(100);

  const changeBPM = (event: any): void => {
    const newBpm = Number(event.target.value);
    setBPM(newBpm);
    changeBpm(newBpm);
  };
  return (
    <div className="w-full max-w-2xl mt-6 flex items-center gap-4">
      <button
        type="button"
        disabled={playing || !sentence}
        onClick={() => playTrack(sentence, bpm)}
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
  );
}
