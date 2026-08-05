import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ThemeEntry, ThemeId } from '../types/theme-types';
import { DEFAULT_THEME, getThemeById } from '../utils/themes';
import { resolveInitialTheme, saveTheme } from '../utils/theme-storage';

type ThemeContextType = {
  theme: ThemeEntry;
  setTheme: (id: ThemeId) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeEntry>(
    () => getThemeById(resolveInitialTheme()) ?? DEFAULT_THEME,
  );

  useEffect(() => {
    if (theme.id === 'blue') {
      delete document.documentElement.dataset.theme;
    } else {
      document.documentElement.dataset.theme = theme.id;
    }
  }, [theme.id]);

  const setTheme = (id: ThemeId) => {
    setThemeState(getThemeById(id) ?? DEFAULT_THEME);
    saveTheme(id);
  };

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextType {
  return useContext(ThemeContext);
}
