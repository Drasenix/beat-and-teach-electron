import { Instrument } from '../models/instrument-model';
import { useInstrumentsContext } from '../contexts/InstrumentsContext';
import {
  createInstrument,
  deleteInstrument,
} from '../facade/instrument-facade';

const useInstruments = () => {
  const { instruments, setInstruments, error } = useInstrumentsContext();

  const addNewInstrument = async (
    instrument: Omit<Instrument, 'id' | 'slug'>,
  ): Promise<void> => {
    const created = await createInstrument(instrument);
    setInstruments((prev) => [...prev, created]);
  };

  const removeInstrument = async (id: number): Promise<void> => {
    await deleteInstrument(id);
    setInstruments((prev) => prev.filter((instrument) => instrument.id !== id));
  };

  const openFileDialog = async (): Promise<string | null> => {
    return window.electron.ipcRenderer.invokeMessage('open-file-dialog');
  };

  return {
    instruments,
    addNewInstrument,
    removeInstrument,
    openFileDialog,
    error,
  };
};

export default useInstruments;
