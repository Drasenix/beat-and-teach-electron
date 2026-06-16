import { useCallback } from 'react';
import { Scissors } from 'lucide-react';
import useWaveformEditor from '../hooks/useWaveformEditor';

interface WaveformEditorProps {
  samples: Float32Array;
  duration: number;
  playbackPosition?: number | null;
  onTrim: (trimmed: Float32Array) => void;
}

function formatTime(seconds: number): string {
  return `${seconds.toFixed(2)}s`;
}

export default function WaveformEditor({
  samples,
  duration,
  playbackPosition,
  onTrim,
}: WaveformEditorProps) {
  const { canvasRef, trimStart, trimEnd, handleMouseDown, applyTrim } =
    useWaveformEditor(samples, playbackPosition);

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
        <Scissors size={16} /> Rogner
      </button>
    </div>
  );
}
