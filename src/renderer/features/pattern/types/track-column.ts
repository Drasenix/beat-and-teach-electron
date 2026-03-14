import { PatternStep } from './pattern-types';

export type TrackColumn = {
  id: string;
  steps: (PatternStep | null)[];
};
