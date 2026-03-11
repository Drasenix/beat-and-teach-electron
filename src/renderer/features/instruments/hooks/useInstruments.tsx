import { useInstrumentsContext } from '../contexts/InstrumentsContext';
import {
  createInstrument,
  deleteInstrument,
  updateInstrument,
} from '../facade/instrument-facade';
import { InstrumentFormValues } from '../types/instrument-types';

const useInstruments = () => {
  const { instruments, setInstruments, error } = useInstrumentsContext();

  const addNewInstrument = async (
    instrument: InstrumentFormValues,
  ): Promise<void> => {
    const created = await createInstrument(instrument);
    setInstruments((prev) => [...prev, created]);
  };

  const editInstrument = async (
    id: number,
    instrument: Partial<InstrumentFormValues>,
  ): Promise<void> => {
    const updated = await updateInstrument(id, instrument);
    setInstruments((prev) => prev.map((i) => (i.id === id ? updated : i)));
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
    editInstrument,
    removeInstrument,
    openFileDialog,
    error,
  };
};

export default useInstruments;
