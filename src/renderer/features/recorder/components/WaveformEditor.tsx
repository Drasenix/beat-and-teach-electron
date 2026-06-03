import { useCallback } from 'react';
import useWaveformEditor from '../hooks/useWaveformEditor';

interface WaveformEditorProps {
  samples: Float32Array;
  duration: number;
  onTrim: (trimmed: Float32Array) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function WaveformEditor({
  samples,
  duration,
  onTrim,
}: WaveformEditorProps) {
  const { canvasRef, trimStart, trimEnd, handleMouseDown, applyTrim } =
    useWaveformEditor(samples);

  const handleTrim = useCallback(() => {
    const trimmed = applyTrim();
    onTrim(trimmed);
  }, [applyTrim, onTrim]);

  const startTime = trimStart * duration;
  const endTime = trimEnd * duration;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-40 rounded-lg cursor-col-resize"
          style={{ height: '160px' }}
          onMouseDown={handleMouseDown}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-text-secondary text-xs font-mono">
          {formatTime(startTime)}
        </span>
        <span className="text-text-secondary text-xs font-mono">
          {formatTime(endTime)}
        </span>
      </div>

      <button
        type="button"
        className="btn-add self-center"
        onClick={handleTrim}
      >
        ✂ Rogner
      </button>
    </div>
  );
}
