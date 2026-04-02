import React, { useState, useCallback } from 'react';

type UseResizableOptions = {
  min: number;
  max: number;
  initial?: number;
};

type UseResizableReturn = {
  size: number;
  setSize: (size: number) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
};

export default function useResizable({
  min,
  max,
  initial,
}: UseResizableOptions): UseResizableReturn {
  const [size, setSize] = useState(initial ?? min);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startSize = size;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newSize = Math.min(
          max,
          Math.max(min, startSize + moveEvent.clientX - startX),
        );
        setSize(newSize);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    [size, min, max],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSize((s) => Math.max(min, s - 10));
      } else if (e.key === 'ArrowRight') {
        setSize((s) => Math.min(max, s + 10));
      }
    },
    [min, max],
  );

  return { size, setSize, handleMouseDown, handleKeyDown };
}
