export type PatternStep = {
  id: string;
  symbol: string;
  valid: boolean;
  isGroup: boolean;
  tokens?: PatternStep[];
};
