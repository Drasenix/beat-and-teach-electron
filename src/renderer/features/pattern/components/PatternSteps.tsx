import React, { useMemo, useState, useRef } from 'react';
import useInstruments from '../../instruments/hooks/useInstruments';
import { parseMultiTrackSteps } from '../utils/pattern-parser';
import { PatternStep } from '../types/pattern-types';
import { TrackColumn, TrackStep } from '../types/track-column';

const HIGHLIGHT_COLORS = [
  { label: 'Rouge', value: 'red' },
  { label: 'Bleu', value: 'blue' },
  { label: 'Vert', value: 'green' },
  { label: 'Jaune', value: 'yellow' },
  { label: 'Orange', value: 'orange' },
];

const COLOR_CLASSES: Record<string, string> = {
  red: 'border-red-400 text-red-400',
  blue: 'border-blue-400 text-blue-400',
  green: 'border-green-400 text-green-400',
  yellow: 'border-yellow-400 text-yellow-400',
  orange: 'border-orange-400 text-orange-400',
};

type PatternStepsProps = {
  sentences: string[];
  highlights: (string | null)[][];
  onChangeHighlight: (
    sentenceIndex: number,
    tokenIndex: number,
    color: string | null,
  ) => void;
};

function getColorClass(highlight: string | null, valid: boolean): string {
  if (highlight) return `${COLOR_CLASSES[highlight]} bg-background`;
  if (valid) return 'step-badge-valid';
  return 'step-badge-invalid';
}

function ColorTooltip({
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: {
  onSelect: (color: string | null) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 bg-surface border border-border rounded-lg px-2 py-1 shadow-xl flex items-center gap-1"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {HIGHLIGHT_COLORS.map(({ label, value }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(value);
          }}
          className="w-3 h-3 rounded-full hover:scale-125 transition-transform"
          style={{ backgroundColor: value }}
        />
      ))}
      <button
        type="button"
        aria-label="Effacer"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(null);
        }}
        className="w-3 h-3 rounded-full border border-border hover:scale-125 transition-transform bg-background"
      />
    </div>
  );
}

function StepBadge({
  token,
  highlight,
  onSelect,
}: {
  token: PatternStep;
  highlight: string | null;
  onSelect: (color: string | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHovered(false), 150);
  };

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
      <span
        className={`step-badge-base ${getColorClass(highlight, token.valid)}`}
      >
        {token.symbol}
      </span>
    </div>
  );
}

function StepCell({
  trackStep,
  highlights,
  onChangeHighlight,
}: {
  trackStep: TrackStep;
  highlights: (string | null)[][];
  onChangeHighlight: (
    sentenceIndex: number,
    tokenIndex: number,
    color: string | null,
  ) => void;
}) {
  const { step, sentenceIndex, tokenIndex } = trackStep;

  if (!step) return <span className="step-cell-empty">—</span>;

  if (step.isGroup && step.steps) {
    return (
      <div className="step-cell-group">
        {step.steps.map((innerToken, i) => (
          <StepBadge
            key={innerToken.id}
            token={innerToken}
            highlight={highlights[sentenceIndex]?.[tokenIndex + i] ?? null}
            onSelect={(color) =>
              onChangeHighlight(sentenceIndex, tokenIndex + i, color)
            }
          />
        ))}
      </div>
    );
  }

  return (
    <div className="step-cell-atomic">
      <StepBadge
        token={step}
        highlight={highlights[sentenceIndex]?.[tokenIndex] ?? null}
        onSelect={(color) =>
          onChangeHighlight(sentenceIndex, tokenIndex, color)
        }
      />
    </div>
  );
}

function Column({
  column,
  highlights,
  onChangeHighlight,
}: {
  column: TrackColumn;
  highlights: (string | null)[][];
  onChangeHighlight: (
    sentenceIndex: number,
    tokenIndex: number,
    color: string | null,
  ) => void;
}) {
  return (
    <div className="step-column">
      {column.steps.map((trackStep) => (
        <StepCell
          key={`${trackStep.sentenceIndex}-${trackStep.tokenIndex}`}
          trackStep={trackStep}
          highlights={highlights}
          onChangeHighlight={onChangeHighlight}
        />
      ))}
    </div>
  );
}

export default function PatternSteps({
  sentences,
  highlights,
  onChangeHighlight,
}: PatternStepsProps) {
  const { instruments } = useInstruments();
  const symbols = useMemo(
    () => instruments.map((i) => i.symbol),
    [instruments],
  );

  const columns: TrackColumn[] = useMemo(
    () => parseMultiTrackSteps(sentences, symbols),
    [sentences, symbols],
  );

  if (columns.length === 0) return null;

  return (
    <div className="pattern-section-content">
      <h2 className="section-title">Pattern</h2>
      <div className="section-background">
        <div className="flex flex-wrap gap-2">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              highlights={highlights}
              onChangeHighlight={onChangeHighlight}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
