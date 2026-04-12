import { useState, useRef } from 'react';
import { PatternStep } from '../types/pattern-types';
import MuteIcon from './MuteIcon';
import ColorTooltip from './ColorTooltip';

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
};

export default function StepBadge({
  token,
  highlight,
  onSelect,
  isMuted,
  onToggleMute,
}: StepBadgeProps) {
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHovered(false), 150);
  };

  const showInteraction = onToggleMute && hovered && !isMuted;

  const content = (
    <>
      {token.symbol}
      {isMuted && <MuteIcon />}
    </>
  );

  const className = `step-badge-base ${getColorClass(highlight, token.valid)} ${isMuted ? 'opacity-40' : ''}`;

  if (!onToggleMute) {
    return (
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hovered && (
          <ColorTooltip
            onSelect={(color) => {
              onSelect(color);
              setHovered(false);
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        )}
        <span className={className}>{content}</span>
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showInteraction && (
        <ColorTooltip
          onSelect={(color) => {
            onSelect(color);
            setHovered(false);
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
      <button
        type="button"
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          onToggleMute();
        }}
      >
        {content}
      </button>
    </div>
  );
}
