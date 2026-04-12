import { TrackColumn } from '../types/track-column';
import StepCell from './StepCell';

type ColumnProps = {
  column: TrackColumn;
  highlights: (string | null)[][];
  onChangeHighlight: (
    sentenceIndex: number,
    tokenIndex: number,
    color: string | null,
  ) => void;
  isActive: boolean;
  isMuted: (sentenceIndex: number, tokenIndex: number) => boolean;
  onToggleMute?: (sentenceIndex: number, tokenIndex: number) => void;
};

export default function Column({
  column,
  highlights,
  onChangeHighlight,
  isActive,
  isMuted,
  onToggleMute,
}: ColumnProps) {
  return (
    <div className={`step-column${isActive ? ' step-column-active' : ''}`}>
      {column.steps.map((trackStep) => (
        <StepCell
          key={`${trackStep.sentenceIndex}-${trackStep.tokenIndex}`}
          trackStep={trackStep}
          highlights={highlights}
          onChangeHighlight={onChangeHighlight}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
        />
      ))}
    </div>
  );
}
