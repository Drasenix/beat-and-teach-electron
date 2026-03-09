import { Instrument } from '../models/instrument-model';
import { createInstrument } from '../facade/instrument-facade';
import { useInstrumentsContext } from '../contexts/InstrumentsContext';

const useInstruments = () => {
  const { instruments, setInstruments, error } = useInstrumentsContext();

  const addNewInstrument = async (
    instrument: Omit<Instrument, 'id' | 'slug'>,
  ): Promise<void> => {
    const created = await createInstrument(instrument);
    setInstruments((prev) => [...prev, created]);
  };

  const openFileDialog = async (): Promise<string | null> => {
    return window.electron.ipcRenderer.invokeMessage('open-file-dialog');
  };

  return { instruments, addNewInstrument, openFileDialog, error };
};

export default useInstruments;
