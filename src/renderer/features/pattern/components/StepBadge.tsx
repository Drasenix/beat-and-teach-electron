import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PatternStep } from '../types/pattern-types';
import MuteIcon from './MuteIcon';
import StepTooltip from './StepTooltip';
import frequencyToNoteName from '../../../utils/frequency-to-note';

const COLOR_CLASSES: Record<string, string> = {
  red: 'border-red-400 text-red-400',
  blue: 'border-blue-400 text-blue-400',
  green: 'border-green-400 text-green-400',
  yellow: 'border-yellow-400 text-yellow-400',
  orange: 'border-orange-400 text-orange-400',
};

function getColorClass(highlight: string | null, valid: boolean): string {
  if (highlight) return `${COLOR_CLASSES[highlight]} bg-background`;
  if (valid) return 'step-badge-valid';
  return 'step-badge-invalid';
}

type StepBadgeProps = {
  token: PatternStep;
  highlight: string | null;
  onSelect: (color: string | null) => void;
  isMuted: boolean;
  onToggleMute?: () => void;
  onFrequencyChange?: (frequency: number | null) => void;
  referenceFrequency?: number | null;
};

export default function StepBadge({
  token,
  highlight,
  onSelect,
  isMuted,
  onToggleMute,
  onFrequencyChange,
  referenceFrequency,
}: StepBadgeProps) {
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties | null>(
    null,
  );

  const updateTooltipPosition = useCallback(() => {
    if (badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      setTooltipStyle({
        position: 'fixed',
        top: rect.top,
        left: rect.left + rect.width / 2,
        transform: 'translate(-50%, calc(-100% - 8px))',
        zIndex: 100,
      });
    }
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    updateTooltipPosition();
    setHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHovered(false);
      setTooltipStyle(null);
    }, 150);
  };

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (!onFrequencyChange || !referenceFrequency) return;
      e.preventDefault();
      const currentFreq = token.frequency ?? referenceFrequency;
      const semitone = e.deltaY < 0 ? 1 : -1;
      const newFreq = currentFreq * 2 ** (semitone / 12);
      onFrequencyChange(newFreq);
    },
    [onFrequencyChange, referenceFrequency, token.frequency],
  );

  useEffect(() => {
    const el = badgeRef.current;
    if (!el) return () => undefined;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleDoubleClick = () => {
    if (token.frequency && onFrequencyChange) {
      onFrequencyChange(null);
    }
  };

  const content = (
    <div className="flex flex-col items-center">
      <span>{token.symbol}</span>
      {token.frequency && referenceFrequency && (
        <span className="text-[10px] leading-tight text-text-secondary">
          {frequencyToNoteName(token.frequency)}
        </span>
      )}
      {isMuted && <MuteIcon />}
    </div>
  );

  const className = `step-badge-base ${getColorClass(highlight, token.valid)} ${isMuted ? 'opacity-40' : ''}`;

  const tooltipPortal =
    hovered && tooltipStyle
      ? createPortal(
          <div style={tooltipStyle}>
            <StepTooltip
              currentFrequency={token.frequency ?? null}
              referenceFrequency={referenceFrequency ?? null}
              onSelectNote={
                onFrequencyChange
                  ? (freq) => onFrequencyChange(freq)
                  : undefined
              }
              onSelectColor={(color) => {
                onSelect(color);
                setHovered(false);
                setTooltipStyle(null);
              }}
              onToggleMute={onToggleMute}
              onResetFrequency={
                token.frequency && onFrequencyChange
                  ? () => onFrequencyChange(null)
                  : undefined
              }
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </div>,
          document.body,
        )
      : null;

  const badgeContent = (
    <div
      ref={badgeRef}
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={className} onDoubleClick={handleDoubleClick}>
        {content}
      </span>
    </div>
  );

  return (
    <>
      {tooltipPortal}
      {badgeContent}
    </>
  );
}
