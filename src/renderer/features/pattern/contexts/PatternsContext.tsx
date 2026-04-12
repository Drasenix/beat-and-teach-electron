import React, {
  useState,
  useEffect,
  useMemo,
  createContext,
  useContext,
} from 'react';
import getPatterns from '../facade/pattern-facade';
import { Pattern } from '../models/pattern-model';

type PatternsContextType = {
  patterns: Pattern[];
  setPatterns: React.Dispatch<React.SetStateAction<Pattern[]>>;
  error: string | null;
};

const PatternsContext = createContext<PatternsContextType>({
  patterns: [],
  setPatterns: () => {},
  error: null,
});

export function PatternsProvider({ children }: { children: React.ReactNode }) {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPatterns();
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setPatterns(sorted);
      } catch {
        setError('Impossible de charger les patterns.');
      }
    };
    fetch();
  }, []);

  const value = useMemo(
    () => ({ patterns, setPatterns, error }),
    [patterns, error],
  );

  return (
    <PatternsContext.Provider value={value}>
      {children}
    </PatternsContext.Provider>
  );
}

export function usePatternsContext(): PatternsContextType {
  return useContext(PatternsContext);
}
