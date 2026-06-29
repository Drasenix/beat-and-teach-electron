import { useMemo } from 'react';
import useInstruments from '../../instruments/hooks/useInstruments';
import { parseSteps, buildFlatTokenIndices } from '../utils/pattern-parser';
import { PatternStep } from '../types/pattern-types';
import StepCell from './StepCell';

type PatternStepsProps = {
  sentences: string[];
  highlights: (string | null)[][];
  onChangeHighlight: (
    sentenceIndex: number,
    tokenIndex: number,
    color: string | null,
  ) => void;
  activeSteps?: number[];
  mutedSteps?: Set<string>;
  toggleMute?: (sentenceIndex: number, tokenIndex: number) => void;
  onFrequencyChange?: (
    sentenceIndex: number,
    tokenIndex: number,
    frequency: number | null,
  ) => void;
};

export default function PatternSteps({
  sentences,
  highlights,
  onChangeHighlight,
  activeSteps,
  mutedSteps,
  toggleMute,
  onFrequencyChange,
}: PatternStepsProps) {
  const { instruments } = useInstruments();

  const symbols = useMemo(
    () => instruments.map((i) => i.symbol),
    [instruments],
  );

  const referenceFrequencies: Map<string, number | null> = useMemo(
    () => new Map(instruments.map((i) => [i.symbol, i.referenceFrequency])),
    [instruments],
  );

  const tracks: { steps: PatternStep[]; tokenIndices: number[] }[] = useMemo(
    () =>
      sentences.map((sentence) => {
        const steps = parseSteps(sentence, symbols);
        const tokenIndices = buildFlatTokenIndices(steps);
        return { steps, tokenIndices };
      }),
    [sentences, symbols],
  );

  const isMuted = (sentenceIndex: number, tokenIndex: number): boolean => {
    return (mutedSteps ?? new Set()).has(`${sentenceIndex}-${tokenIndex}`);
  };

  const handleToggleMute = toggleMute
    ? (sentenceIndex: number, tokenIndex: number) => {
        toggleMute(sentenceIndex, tokenIndex);
      }
    : undefined;

  if (tracks.every((t) => t.steps.length === 0)) return null;

  return (
    <div className="pattern-section-content">
      <h2 className="section-title">Pattern</h2>
      <div id="pattern-preview" className="section-background">
        {tracks.map((track, trackIndex) => {
          if (track.steps.length === 0) return null;
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={trackIndex} className="mb-3">
              <span className="text-xs font-mono text-text-secondary bg-surface px-2 py-1 rounded border border-border">
                {track.steps.length} temps
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {track.steps.map((step, stepIndex) => (
                  <StepCell
                    key={step.id}
                    step={step}
                    sentenceIndex={trackIndex}
                    tokenIndex={track.tokenIndices[stepIndex]}
                    isActive={activeSteps?.[trackIndex] === stepIndex}
                    highlights={highlights}
                    onChangeHighlight={onChangeHighlight}
                    isMuted={isMuted}
                    onToggleMute={handleToggleMute}
                    onFrequencyChange={onFrequencyChange}
                    referenceFrequencies={referenceFrequencies}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
