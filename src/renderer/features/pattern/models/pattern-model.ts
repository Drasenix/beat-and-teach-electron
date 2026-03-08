export interface Pattern {
  id: number;
  slug: string;
  name: string;
  sentence: string;
}
export const DEFAULT_PATTERN: Pattern = {
  id: 0,
  slug: '',
  name: '',
  sentence: '',
};
