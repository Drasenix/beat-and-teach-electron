import { ThemeEntry } from '../types/theme-types';

const THEME_REGISTRY: ThemeEntry[] = [
  {
    id: 'blue',
    label: 'Bleu',
    accentHex: '#679ff9',
  },
  {
    id: 'green',
    label: 'Vert',
    accentHex: '#4ade80',
  },
  {
    id: 'pink',
    label: 'Rose',
    accentHex: '#f472b6',
  },
];

export const themes = new Proxy<ThemeEntry[]>(THEME_REGISTRY, {
  get(target: ThemeEntry[], prop: string | symbol): unknown {
    const value = Reflect.get(target, prop);
    if (typeof value === 'function') {
      return (...args: unknown[]) => value.apply([...target], args);
    }
    return value;
  },
});

export function getThemeById(id: unknown): ThemeEntry | null {
  if (typeof id !== 'string') return null;
  const found = THEME_REGISTRY.find((entry: ThemeEntry) => entry.id === id);
  return found ?? null;
}

export function isValidThemeId(id: unknown): boolean {
  return getThemeById(id) !== null;
}

export const DEFAULT_THEME: ThemeEntry = THEME_REGISTRY[0];
