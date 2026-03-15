import { useMemo } from 'react';
import useInstruments from '../../instruments/hooks/useInstruments';
import { parseMultiTrackSteps } from '../utils/pattern-parser';
import { PatternStep } from '../types/pattern-types';
import { TrackColumn } from '../types/track-column';

type PatternStepsProps = {
  sentences: string[];
};

function StepBadge({ token }: { token: PatternStep }) {
  const baseClass = 'step-badge-base';
  const validClass = 'step-badge-valid';
  const invalidClass = 'step-badge-invalid';

  return (
    <span className={`${baseClass} ${token.valid ? validClass : invalidClass}`}>
      {token.symbol}
    </span>
  );
}

function StepCell({ step }: { step: PatternStep | null }) {
  if (!step) {
    return <span className="step-cell-empty">—</span>;
  }
  if (step.isGroup && step.steps) {
    return (
      <div className="step-cell-group">
        {step.steps.map((innerToken) => (
          <StepBadge key={innerToken.id} token={innerToken} />
        ))}
      </div>
    );
  }
  return (
    <div className="step-cell-atomic">
      <StepBadge token={step} />
    </div>
  );
}

function Column({ column }: { column: TrackColumn }) {
  return (
    <div className="step-column">
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
    <div className="pattern-section-content">
      <h2 className="section-title">Pattern</h2>
      <div className="section-background">
        <div className="flex flex-wrap gap-2">
          {columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </div>
      </div>
    </div>
  );
}
