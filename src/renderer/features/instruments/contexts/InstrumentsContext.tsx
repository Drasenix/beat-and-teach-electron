import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { getInstruments } from '../facade/instrument-facade';
import { Instrument } from '../models/instrument-model';

type InstrumentsContextType = {
  instruments: Instrument[];
  setInstruments: React.Dispatch<React.SetStateAction<Instrument[]>>;
  error: string | null;
};

const InstrumentsContext = createContext<InstrumentsContextType>({
  instruments: [],
  setInstruments: () => {},
  error: null,
});

export function InstrumentsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const data = await getInstruments();
        setInstruments(data);
      } catch {
        setError('Impossible de charger les instruments.');
      }
    };

    fetchInstruments();
  }, []);

  const value = useMemo(
    () => ({ instruments, setInstruments, error }),
    [instruments, error],
  );

  return (
    <InstrumentsContext.Provider value={value}>
      {children}
    </InstrumentsContext.Provider>
  );
}

export function useInstrumentsContext(): InstrumentsContextType {
  return useContext(InstrumentsContext);
}
