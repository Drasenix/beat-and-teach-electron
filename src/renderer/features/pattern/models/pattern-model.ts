export interface Pattern {
  id: number;
  slug: string;
  name: string;
  sentences: string[];
}

export const DEFAULT_PATTERN: Pattern = {
  id: 0,
  slug: '',
  name: '',
  sentences: [],
};
