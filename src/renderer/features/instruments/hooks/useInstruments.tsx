import { useEffect, useState } from 'react';
import { Instrument } from '../models/instrument-model';
import { createInstrument, getInstruments } from '../facade/instrument-facade';

const useInstruments = () => {
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  useEffect(() => {
    const fetchPattern = async () => {
      setInstruments(await getInstruments());
    };

    fetchPattern();
  }, []);

  const addNewInstrument = async (
    instrument: Omit<Instrument, 'id' | 'slug'>,
  ): Promise<void> => {
    const created = await createInstrument(instrument);
    setInstruments((prev) => [...prev, created]);
  };

  const openFileDialog = async (): Promise<string | null> => {
    return window.electron.ipcRenderer.invokeMessage('open-file-dialog');
  };

  return { instruments, addNewInstrument, openFileDialog };
};

export default useInstruments;
