import { useMemo } from 'react';
import useInstruments from '../../instruments/hooks/useInstruments';
import { parseMultiTrackSteps } from '../utils/pattern-parser';
import { PatternStep } from '../types/pattern-types';
import { TrackColumn } from '../types/track-column';

type PatternStepsProps = {
  sentences: string[];
};

function StepBadge({ token }: { token: PatternStep }) {
  const baseClass = 'font-mono font-bold px-2 py-1 rounded text-sm';
  const validClass = 'text-primary bg-background border border-border';
  const invalidClass = 'text-red-400 bg-background border border-red-400';

  return (
    <span className={`${baseClass} ${token.valid ? validClass : invalidClass}`}>
      {token.symbol}
    </span>
  );
}

function StepCell({ step }: { step: PatternStep | null }) {
  if (!step) {
    return (
      <span className="font-mono font-bold px-2 py-1 rounded text-sm text-border bg-background border border-border opacity-30">
        —
      </span>
    );
  }
  if (step.isGroup && step.steps) {
    return (
      <div className="flex items-center gap-1 border border-dashed border-border rounded-lg px-2 py-1">
        {step.steps.map((innerToken) => (
          <StepBadge key={innerToken.id} token={innerToken} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 rounded-lg px-2 py-1">
      <StepBadge token={step} />
    </div>
  );
}

function Column({ column }: { column: TrackColumn }) {
  return (
    <div className="flex flex-col gap-2">
      {column.steps.map((step, trackIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <StepCell key={trackIndex} step={step} />
      ))}
    </div>
  );
}

export default function PatternSteps({ sentences }: PatternStepsProps) {
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
    <div className="w-full mt-4 p-4 bg-surface rounded-lg border border-border">
      <p className="section-title mb-3">Aperçu</p>
      <div className="flex flex-wrap gap-2">
        {columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
}
