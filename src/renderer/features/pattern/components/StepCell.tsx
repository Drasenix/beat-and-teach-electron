import { PatternStep } from '../types/pattern-types';
import StepBadge from './StepBadge';

type StepCellProps = {
  step: PatternStep;
  sentenceIndex: number;
  tokenIndex: number;
  isActive?: boolean;
  highlights: (string | null)[][];
  onChangeHighlight: (
    sentenceIndex: number,
    tokenIndex: number,
    color: string | null,
  ) => void;
  isMuted: (sentenceIndex: number, tokenIndex: number) => boolean;
  onToggleMute?: (sentenceIndex: number, tokenIndex: number) => void;
  onFrequencyChange?: (
    sentenceIndex: number,
    tokenIndex: number,
    frequency: number | null,
  ) => void;
  referenceFrequencies?: Map<string, number | null>;
};

export default function StepCell({
  step,
  sentenceIndex,
  tokenIndex,
  isActive,
  highlights,
  onChangeHighlight,
  isMuted,
  onToggleMute,
  onFrequencyChange,
  referenceFrequencies,
}: StepCellProps) {
  const getReferenceFrequency = (symbol: string): number | null => {
    return referenceFrequencies?.get(symbol) ?? null;
  };

  if (step.isGroup && step.steps) {
    return (
      <div className={`step-cell-group${isActive ? ' step-active-pulse' : ''}`}>
        {step.steps.map((innerToken, i) => {
          const innerTokenIndex = tokenIndex + i;
          return (
            <StepBadge
              key={innerToken.id}
              token={innerToken}
              highlight={highlights[sentenceIndex]?.[innerTokenIndex] ?? null}
              onSelect={(color) =>
                onChangeHighlight(sentenceIndex, innerTokenIndex, color)
              }
              isMuted={isMuted(sentenceIndex, innerTokenIndex)}
              onToggleMute={
                onToggleMute
                  ? () => onToggleMute(sentenceIndex, innerTokenIndex)
                  : undefined
              }
              onFrequencyChange={
                onFrequencyChange
                  ? (freq) =>
                      onFrequencyChange(sentenceIndex, innerTokenIndex, freq)
                  : undefined
              }
              referenceFrequency={getReferenceFrequency(innerToken.symbol)}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className={`step-cell-atomic${isActive ? ' step-active-pulse' : ''}`}>
      <StepBadge
        token={step}
        highlight={highlights[sentenceIndex]?.[tokenIndex] ?? null}
        onSelect={(color) =>
          onChangeHighlight(sentenceIndex, tokenIndex, color)
        }
        isMuted={isMuted(sentenceIndex, tokenIndex)}
        onToggleMute={
          onToggleMute
            ? () => onToggleMute(sentenceIndex, tokenIndex)
            : undefined
        }
        onFrequencyChange={
          onFrequencyChange
            ? (freq) => onFrequencyChange(sentenceIndex, tokenIndex, freq)
            : undefined
        }
        referenceFrequency={getReferenceFrequency(step.symbol)}
      />
    </div>
  );
}
