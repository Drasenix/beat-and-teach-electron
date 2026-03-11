import { useMemo } from 'react';
import useInstruments from '../../instruments/hooks/useInstruments';
import { parseSteps } from '../utils/pattern-parser';
import { Pattern } from '../models/pattern-model';
import { PatternStep } from '../types/pattern-types';

type PatternStepsProps = {
  pattern: Pattern;
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

export default function PatternSteps(props: PatternStepsProps) {
  const { pattern } = props;
  const { instruments } = useInstruments();
  const steps: PatternStep[] = useMemo(
    () =>
      parseSteps(
        pattern.sentence,
        instruments.map((i) => i.symbol),
      ),
    [pattern.sentence, instruments],
  );
  if (steps.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mt-4 p-4 bg-surface rounded-lg border border-border">
      <p className="section-title mb-3">Aperçu</p>
      <div className="flex flex-wrap gap-2">
        {steps.map((step) => {
          if (step.isGroup && step.steps) {
            return (
              <div
                key={step.id}
                className="flex items-center gap-1 border border-dashed border-border rounded-lg px-2 py-1"
              >
                {step.steps.map((innerToken) => (
                  <StepBadge key={innerToken.id} token={innerToken} />
                ))}
              </div>
            );
          }
          return <StepBadge key={step.id} token={step} />;
        })}
      </div>
    </div>
  );
}
