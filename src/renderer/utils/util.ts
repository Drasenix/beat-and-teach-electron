export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function removeParenthesis(string: string): string {
  return string.replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
}
