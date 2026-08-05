import { ThemeId } from '../types/theme-types';
import { getThemeById, isValidThemeId } from './themes';

const THEME_STORAGE_KEY = 'beat-and-teach:theme';

export function getStoredTheme(): ThemeId | null {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    return getThemeById(raw)?.id ?? null;
  } catch {
    return null;
  }
}

function writeStoredTheme(theme: string): boolean {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return false;
    }
    return false;
  }
}

export function saveTheme(theme: string): void {
  if (isValidThemeId(theme)) {
    writeStoredTheme(theme);
  }
}

export function resolveInitialTheme(): ThemeId {
  return getStoredTheme() ?? 'blue';
}
