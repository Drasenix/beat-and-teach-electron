export type PatternToken = {
  id: string;
  symbol: string;
  valid: boolean;
  isGroup: boolean;
  tokens?: PatternToken[];
};
