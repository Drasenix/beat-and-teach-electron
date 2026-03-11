export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function removeParenthesis(string: string): string {
  return string.replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
}

export function toSnakeCase(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export function extractIpcError(
  error: any,
  fallback = 'Une erreur est survenue.',
): string {
  const raw: string = error?.message ?? fallback;
  return (
    raw.replace(/^Error invoking remote method '[^']+': Error: /, '') ||
    fallback
  );
}
