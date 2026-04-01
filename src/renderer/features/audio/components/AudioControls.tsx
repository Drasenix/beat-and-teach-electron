import { useState, useEffect } from 'react';
import useAudio from '../hooks/useAudio';
import useSlider from '../../../hooks/useSlider';

type AudioControlsProps = {
  sentences: string[];
};

export default function AudioControls({ sentences }: AudioControlsProps) {
  const { playing, playTrack, stopTrack, changeBpm } = useAudio();
  const [bpm, setBPM] = useState<number>(100);

  const { ref: sliderRef } = useSlider({
    value: bpm,
    min: 1,
    max: 300,
    onChange: (newBpm) => {
      setBPM(newBpm);
      changeBpm(newBpm);
    },
  });

  const changeBPM = (event: any): void => {
    const newBpm = Number(event.target.value);
    setBPM(newBpm);
    changeBpm(newBpm);
  };

  const allSentencesValid =
    sentences.length > 0 && sentences.every((s) => s.trim().length > 0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.ctrlKey && e.key === 'Enter') {
        if (playing) {
          stopTrack();
        } else if (allSentencesValid) {
          playTrack(sentences, bpm);
        }
      }

      if (e.ctrlKey && e.key === 'ArrowUp') {
        e.preventDefault();
        const newBpm = Math.min(bpm + 1, 300);
        setBPM(newBpm);
        changeBpm(newBpm);
      }

      if (e.ctrlKey && e.key === 'ArrowDown') {
        e.preventDefault();
        const newBpm = Math.max(bpm - 1, 1);
        setBPM(newBpm);
        changeBpm(newBpm);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    playing,
    allSentencesValid,
    sentences,
    bpm,
    playTrack,
    stopTrack,
    changeBpm,
  ]);

  return (
    <>
      <h2 className="section-title">Controls</h2>
      <div className="flex items-center gap-4 section-background">
        <button
          type="button"
          disabled={playing || !allSentencesValid}
          onClick={() => playTrack(sentences, bpm)}
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
            <span className="text-primary uppercase tracking-widest font-bold">
              BPM
            </span>
            <span className="text-text-accent font-bold">{bpm}</span>
          </div>
          <input
            ref={sliderRef}
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
    </>
  );
}
