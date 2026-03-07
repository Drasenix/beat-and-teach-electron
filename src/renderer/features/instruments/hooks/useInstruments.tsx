import { useEffect, useState } from 'react';
import { Instrument } from '../models/instrument-model';
import { getInstruments } from '../facade/instrument-facade';

const useInstruments = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  useEffect(() => {
    const fetchPattern = async () => {
      const instruments: Instrument[] = await getInstruments();
      setInstruments(instruments);
    };

    fetchPattern();
  }, []);
  return { instruments };
};

export default useInstruments;
