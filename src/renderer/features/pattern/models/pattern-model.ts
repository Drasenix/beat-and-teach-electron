export interface Pattern {
  id: number;
  slug: string;
  name: string;
  sentences: string[];
  highlights: (string | null)[][];
}

export const DEFAULT_PATTERN: Pattern = {
  id: 0,
  slug: '',
  name: '',
  sentences: [],
  highlights: [],
};
