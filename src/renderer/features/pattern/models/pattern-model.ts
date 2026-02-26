export interface Pattern {
  id: string;
  name: string;
  sentence: string;
}

export function getDefaultPattern(): Pattern {
  return {
    id: '',
    name: '',
    sentence: '',
  };
}
