import { useRef, useEffect } from 'react';

type UseSliderProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

const useSlider = ({ value, min, max, onChange }: UseSliderProps) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const slider = ref.current;
    if (!slider) return undefined;

    const handleWheel = (e: WheelEvent): void => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 1 : -1;
      const newValue = Math.min(max, Math.max(min, value + delta));
      onChange(newValue);
    };

    slider.addEventListener('wheel', handleWheel, { passive: false });
    return () => slider.removeEventListener('wheel', handleWheel);
  }, [value, min, max, onChange]);

  return { ref };
};

export default useSlider;
