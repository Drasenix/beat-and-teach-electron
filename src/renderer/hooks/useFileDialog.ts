import { FilePath } from '../../shared/types/file';

const useFileDialog = () => {
  const openFileDialog = async (): Promise<FilePath> => {
    return window.electron.ipcRenderer.invokeMessage('open-file-dialog');
  };

  return { openFileDialog };
};

export default useFileDialog;
