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
  saveError: string | null;
  setSaveError: React.Dispatch<React.SetStateAction<string | null>>;
};

const PatternsContext = createContext<PatternsContextType>({
  patterns: [],
  setPatterns: () => {},
  saveError: null,
  setSaveError: () => {},
});

export function PatternsProvider({ children }: { children: React.ReactNode }) {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPatterns();
        setPatterns(data);
      } catch {
        // silencieux au chargement
      }
    };
    fetch();
  }, []);

  const value = useMemo(
    () => ({ patterns, setPatterns, saveError, setSaveError }),
    [patterns, saveError],
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
