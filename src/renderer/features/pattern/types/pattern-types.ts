import { Pattern } from '../models/pattern-model';

export type PatternFormValues = Omit<Pattern, 'id' | 'slug'>;

export type PatternStep = {
  id: string;
  symbol: string;
  valid: boolean;
  isGroup: boolean;
  steps?: PatternStep[];
};
