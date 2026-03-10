type PatternControlsProps = {
  playing: boolean;
  sentence: string;
  bpm: number;
  onPlay: () => void;
  onStop: () => void;
  onChangeBpm: (event: any) => void;
};

export default function PatternControls({
  playing,
  sentence,
  bpm,
  onPlay,
  onStop,
  onChangeBpm,
}: PatternControlsProps) {
  return (
    <div className="w-full max-w-2xl mt-6 flex items-center gap-4">
      <button
        type="button"
        disabled={playing || !sentence}
        onClick={onPlay}
        className="btn-primary"
      >
        ▶ Play
      </button>

      <button
        type="button"
        disabled={!playing}
        onClick={onStop}
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
          onChange={onChangeBpm}
          className="w-full accent-primary cursor-pointer"
        />
      </div>
    </div>
  );
}
