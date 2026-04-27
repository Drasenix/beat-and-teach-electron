import { useMemo } from 'react';
import useInstruments from '../../instruments/hooks/useInstruments';
import { parseMultiTrackSteps } from '../utils/pattern-parser';
import { TrackColumn } from '../types/track-column';
import Column from './Column';

type PatternStepsProps = {
  sentences: string[];
  highlights: (string | null)[][];
  onChangeHighlight: (
    sentenceIndex: number,
    tokenIndex: number,
    color: string | null,
  ) => void;
  activeColumnIndex?: number | null;
  mutedSteps?: Set<string>;
  toggleMute?: (sentenceIndex: number, tokenIndex: number) => void;
};

export default function PatternSteps({
  sentences,
  highlights,
  onChangeHighlight,
  activeColumnIndex,
  mutedSteps,
  toggleMute,
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

  const isMuted = (sentenceIndex: number, tokenIndex: number): boolean => {
    return (mutedSteps ?? new Set()).has(`${sentenceIndex}-${tokenIndex}`);
  };

  const handleToggleMute = toggleMute
    ? (sentenceIndex: number, tokenIndex: number) => {
        toggleMute(sentenceIndex, tokenIndex);
      }
    : undefined;

  if (columns.length === 0) return null;

  return (
    <div className="pattern-section-content">
      <h2 className="section-title">Pattern</h2>
      <div id="pattern-preview" className="section-background">
        <span
          id="time"
          className="text-xs font-mono text-text-secondary bg-surface px-2 py-1 rounded border border-border"
        >
          {columns.length} temps
        </span>
        <div id="steps" className="flex flex-wrap gap-2">
          {columns.map((column, index) => (
            <Column
              key={column.id}
              column={column}
              highlights={highlights}
              onChangeHighlight={onChangeHighlight}
              isActive={activeColumnIndex === index}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
