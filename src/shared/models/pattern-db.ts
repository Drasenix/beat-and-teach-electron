export interface PatternDB {
  id: number;
  slug: string;
  name: string;
  sentences: string;
  highlights: string; // JSON string — ex: '[[null, "red", null], [null, null]]'
}
