import { PatternStep } from './pattern-types';

export type TrackStep = {
  step: PatternStep | null;
  sentenceIndex: number;
  tokenIndex: number;
};

export type TrackColumn = {
  id: string;
  steps: TrackStep[];
};
