export default function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}
