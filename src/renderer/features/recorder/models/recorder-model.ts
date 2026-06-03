export type RecordingState =
  | 'idle'
  | 'recording'
  | 'recorded'
  | 'editing'
  | 'saving'
  | 'saved';

export interface TrimRange {
  start: number;
  end: number;
}
