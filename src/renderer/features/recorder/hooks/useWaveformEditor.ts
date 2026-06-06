import {
  useRef,
  useState,
  useCallback,
  useEffect,
  type MouseEvent,
} from 'react';
import { renderWaveform, trimSamples } from '../utils/waveform-renderer';

export default function useWaveformEditor(
  samples: Float32Array,
  playbackPosition?: number | null,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(1);
  const draggingRef = useRef<'start' | 'end' | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    renderWaveform({
      canvas,
      samples,
      trimStart,
      trimEnd,
      playbackPosition: playbackPosition ?? null,
    });
  }, [samples, trimStart, trimEnd, playbackPosition]);

  const getCursorFromEvent = useCallback(
    (clientX: number): 'start' | 'end' => {
      const canvas = canvasRef.current;
      if (canvas === null) return 'end';

      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const distStart = Math.abs(x - trimStart);
      const distEnd = Math.abs(x - trimEnd);

      return distStart <= distEnd ? 'start' : 'end';
    },
    [trimStart, trimEnd],
  );

  const handleMouseDown = useCallback(
    (e: MouseEvent<HTMLCanvasElement>) => {
      const cursor = getCursorFromEvent(e.clientX);
      draggingRef.current = cursor;
    },
    [getCursorFromEvent],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggingRef.current === null) return;

      const canvas = canvasRef.current;
      if (canvas === null) return;

      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

      if (draggingRef.current === 'start') {
        setTrimStart(Math.min(x, trimEnd - 0.01));
      } else {
        setTrimEnd(Math.max(x, trimStart + 0.01));
      }
    },
    [trimStart, trimEnd],
  );

  const handleMouseUp = useCallback(() => {
    draggingRef.current = null;
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const applyTrim = useCallback((): Float32Array => {
    return trimSamples(samples, trimStart, trimEnd);
  }, [samples, trimStart, trimEnd]);

  return {
    canvasRef,
    trimStart,
    trimEnd,
    setTrimStart,
    setTrimEnd,
    handleMouseDown,
    applyTrim,
  };
}
